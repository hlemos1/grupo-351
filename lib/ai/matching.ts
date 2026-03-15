/**
 * Motor de matchmaking — conecta empresas a oportunidades.
 *
 * Camada 1: Scoring determinístico (setor, interesses, localização, estágio)
 * Camada 2: Análise IA (gera motivo e refina score) — opcional, requer API key
 */

import { prisma } from "@/lib/prisma";
import { streamChat, type AiMessage } from "./provider";

export interface MatchCandidate {
  companyId: string;
  companyNome: string;
  companySlug: string;
  companySetor: string;
  userId: string;
  score: number;
  motivo: string;
  factors: string[];
}

interface CompanyProfile {
  id: string;
  slug: string;
  nome: string;
  setor: string;
  pais: string;
  cidade: string | null;
  estagio: string;
  interesses: string[];
  descricao: string | null;
  ownerId: string;
}

interface OpportunityData {
  id: string;
  titulo: string;
  tipo: string;
  setor: string;
  descricao: string;
  requisitos: string | null;
  budget: string | null;
  localizacao: string | null;
  companyId: string;
}

// ─── Camada 1: Scoring determinístico ───

function scoreMatch(company: CompanyProfile, opp: OpportunityData): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Mesmo setor (+30)
  if (company.setor.toLowerCase() === opp.setor.toLowerCase()) {
    score += 30;
    factors.push("Mesmo setor");
  } else if (opp.setor.toLowerCase().includes(company.setor.toLowerCase()) ||
             company.setor.toLowerCase().includes(opp.setor.toLowerCase())) {
    score += 15;
    factors.push("Setor relacionado");
  }

  // Interesses alinhados com tipo de oportunidade (+20)
  const tipoToInteresse: Record<string, string[]> = {
    franquia: ["franquia", "expansao"],
    investimento: ["investimento", "financeiro"],
    parceria: ["expansao", "tecnologia", "logistica", "marketing"],
    fornecedor: ["fornecedor", "logistica"],
    expansao: ["expansao", "franquia"],
  };
  const relevantInteresses = tipoToInteresse[opp.tipo] || [];
  const matched = company.interesses.filter((i) => relevantInteresses.includes(i));
  if (matched.length > 0) {
    score += Math.min(matched.length * 10, 20);
    factors.push(`Interesses: ${matched.join(", ")}`);
  }

  // Mesmo país (+15) ou mesma cidade (+10 extra)
  if (opp.localizacao) {
    const loc = opp.localizacao.toLowerCase();
    if (loc.includes(company.pais.toLowerCase())) {
      score += 15;
      factors.push("Mesmo país");
    }
    if (company.cidade && loc.includes(company.cidade.toLowerCase())) {
      score += 10;
      factors.push("Mesma cidade");
    }
  }

  // Estágio compatível (+15)
  const estagioScore: Record<string, number> = {
    ideacao: 1, validacao: 2, operando: 3, escala: 4, consolidado: 5,
  };
  const companyStage = estagioScore[company.estagio] || 3;
  if (companyStage >= 3) {
    score += 15;
    factors.push("Empresa em estágio operacional");
  } else if (companyStage === 2) {
    score += 8;
    factors.push("Empresa em validação");
  }

  // Verificada (+10)
  // Note: verificada is not in CompanyProfile but we can check via prisma later

  return { score: Math.min(score, 100), factors };
}

// ─── Camada 2: Análise IA ───

async function aiAnalyzeMatch(
  company: CompanyProfile,
  opp: OpportunityData,
  baseScore: number
): Promise<{ score: number; motivo: string }> {
  const prompt = `Analise a compatibilidade entre esta empresa e oportunidade.

EMPRESA:
- Nome: ${company.nome}
- Setor: ${company.setor}
- País: ${company.pais}${company.cidade ? `, ${company.cidade}` : ""}
- Estágio: ${company.estagio}
- Interesses: ${company.interesses.join(", ") || "não informados"}
- Descrição: ${company.descricao || "não informada"}

OPORTUNIDADE:
- Título: ${opp.titulo}
- Tipo: ${opp.tipo}
- Setor: ${opp.setor}
- Descrição: ${opp.descricao}
- Requisitos: ${opp.requisitos || "não especificados"}
- Budget: ${opp.budget || "não informado"}
- Localização: ${opp.localizacao || "não informada"}

SCORE BASE (heurística): ${baseScore}/100

Responda APENAS em JSON com esta estrutura exata:
{"score": <número 0-100 ajustado>, "motivo": "<1-2 frases em português explicando por que este match faz sentido ou não>"}`;

  const messages: AiMessage[] = [{ role: "user", content: prompt }];
  const systemPrompt = "Você é um analista de negócios do Grupo +351. Responda apenas em JSON válido, sem markdown.";

  let fullResponse = "";
  try {
    for await (const chunk of streamChat({ messages, systemPrompt })) {
      fullResponse += chunk;
    }

    // Parse JSON da resposta
    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: Math.max(0, Math.min(100, Number(parsed.score) || baseScore)),
        motivo: String(parsed.motivo || "Match analisado por IA"),
      };
    }
  } catch {
    // Fallback se IA falhar
  }

  return { score: baseScore, motivo: "Match identificado por compatibilidade de perfil" };
}

// ─── API pública ───

/**
 * Encontra empresas compatíveis com uma oportunidade.
 * Retorna top N candidatos ordenados por score.
 */
export async function findMatchesForOpportunity(
  opportunityId: string,
  options: { limit?: number; useAI?: boolean } = {}
): Promise<MatchCandidate[]> {
  const { limit = 10, useAI = false } = options;

  const opp = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });
  if (!opp) return [];

  // Buscar empresas ativas (excluindo a dona da oportunidade)
  const companies = await prisma.company.findMany({
    where: {
      ativa: true,
      id: { not: opp.companyId },
    },
    select: {
      id: true, slug: true, nome: true, setor: true,
      pais: true, cidade: true, estagio: true, interesses: true,
      descricao: true, ownerId: true,
    },
  });

  // Verificar matches já existentes para não duplicar
  const existingMatches = await prisma.match.findMany({
    where: { opportunityId },
    select: { toUserId: true },
  });
  const alreadyMatched = new Set(existingMatches.map((m) => m.toUserId));

  // Scoring
  let candidates: MatchCandidate[] = [];

  for (const company of companies) {
    if (alreadyMatched.has(company.ownerId)) continue;

    const { score, factors } = scoreMatch(company, opp);

    // Só considerar matches com score mínimo de 20
    if (score < 20) continue;

    let finalScore = score;
    let motivo = factors.join(" | ");

    if (useAI && score >= 40) {
      // Só usar IA para candidatos promissores (economizar tokens)
      const aiResult = await aiAnalyzeMatch(company, opp, score);
      finalScore = aiResult.score;
      motivo = aiResult.motivo;
    }

    candidates.push({
      companyId: company.id,
      companyNome: company.nome,
      companySlug: company.slug,
      companySetor: company.setor,
      userId: company.ownerId,
      score: finalScore,
      motivo,
      factors,
    });
  }

  // Ordenar por score descendente e limitar
  candidates.sort((a, b) => b.score - a.score);
  candidates = candidates.slice(0, limit);

  return candidates;
}

/**
 * Executa matchmaking e salva os matches no banco.
 * Retorna número de matches criados.
 */
export async function runMatchmaking(
  opportunityId: string,
  options: { limit?: number; useAI?: boolean; fromUserId: string } = { fromUserId: "" }
): Promise<number> {
  const candidates = await findMatchesForOpportunity(opportunityId, options);

  let created = 0;
  for (const candidate of candidates) {
    try {
      await prisma.match.create({
        data: {
          opportunityId,
          fromUserId: options.fromUserId,
          toUserId: candidate.userId,
          score: candidate.score,
          motivo: candidate.motivo,
          status: "sugerido",
        },
      });
      created++;
    } catch {
      // Unique constraint — match já existe
    }
  }

  return created;
}

/**
 * Sugere oportunidades para uma empresa específica.
 */
export async function suggestOpportunitiesForCompany(
  companyId: string,
  options: { limit?: number } = {}
): Promise<{ opportunityId: string; titulo: string; tipo: string; score: number; motivo: string }[]> {
  const { limit = 10 } = options;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true, slug: true, nome: true, setor: true,
      pais: true, cidade: true, estagio: true, interesses: true,
      descricao: true, ownerId: true,
    },
  });
  if (!company) return [];

  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: "aberta",
      companyId: { not: companyId },
    },
    take: 50,
    orderBy: { criadoEm: "desc" },
  });

  const results = opportunities.map((opp) => {
    const { score, factors } = scoreMatch(company, opp);
    return {
      opportunityId: opp.id,
      titulo: opp.titulo,
      tipo: opp.tipo,
      score,
      motivo: factors.join(" | "),
    };
  });

  return results
    .filter((r) => r.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
