import type { Candidatura } from "./admin-types";

export interface ScoreResult {
  total: number; // 0-100
  breakdown: {
    perfil: number;
    capital: number;
    experiencia: number;
    motivacao: number;
    disponibilidade: number;
  };
  tier: "A" | "B" | "C" | "D";
  flags: string[];
}

/**
 * Scoring automático de candidaturas.
 * Gera uma pontuação 0-100 com base nos dados do candidato.
 */
export function scoreCandidatura(
  data: Omit<Candidatura, "id" | "criadoEm" | "status">
): ScoreResult {
  const breakdown = {
    perfil: scorePerfil(data),
    capital: scoreCapital(data.capitalDisponivel),
    experiencia: scoreExperiencia(data),
    motivacao: scoreTexto(data.motivacao),
    disponibilidade: scoreDisponibilidade(data),
  };

  const total = Math.round(
    breakdown.perfil * 0.15 +
      breakdown.capital * 0.25 +
      breakdown.experiencia * 0.2 +
      breakdown.motivacao * 0.2 +
      breakdown.disponibilidade * 0.2
  );

  const tier =
    total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";

  const flags: string[] = [];
  if (data.aceitaNDA) flags.push("NDA aceito");
  if (data.linkedin) flags.push("LinkedIn informado");
  if (data.perfil === "ambos") flags.push("Perfil duplo (operador+investidor)");
  if (data.modelo.length >= 2) flags.push(`Interesse em ${data.modelo.length} marcas`);
  if (breakdown.capital >= 80) flags.push("Capital elevado");
  if (total >= 80) flags.push("Candidato prioritário");

  return { total, breakdown, tier, flags };
}

function scorePerfil(
  data: Omit<Candidatura, "id" | "criadoEm" | "status">
): number {
  let score = 40;
  if (data.perfil === "ambos") score += 30;
  else if (data.perfil === "operador") score += 20;
  else score += 15;
  if (data.linkedin) score += 15;
  if (data.empresaAtual) score += 15;
  return Math.min(score, 100);
}

function scoreCapital(capital: string): number {
  const lower = capital.toLowerCase().replace(/\s/g, "");
  if (lower.includes("200") || lower.includes("acima")) return 100;
  if (lower.includes("100") || lower.includes("50k-200k") || lower.includes("50.000")) return 80;
  if (lower.includes("50") || lower.includes("10k-50k") || lower.includes("10.000")) return 60;
  if (lower.includes("10") || lower.includes("ate") || lower.includes("até")) return 40;
  if (lower.includes("definir") || lower.includes("negociar")) return 20;
  return 30;
}

function scoreExperiencia(
  data: Omit<Candidatura, "id" | "criadoEm" | "status">
): number {
  let score = 0;
  const exp = data.experiencia.toLowerCase();
  if (exp.includes("10+") || exp.includes("mais de 10")) score += 40;
  else if (exp.includes("5") || exp.includes("anos")) score += 25;
  else score += 10;

  if (data.setor) score += 20;
  if (data.empresaAtual) score += 20;

  const dif = data.diferenciais.length;
  if (dif > 200) score += 20;
  else if (dif > 50) score += 10;

  return Math.min(score, 100);
}

function scoreTexto(text: string): number {
  const len = text.length;
  if (len > 500) return 90;
  if (len > 200) return 70;
  if (len > 100) return 50;
  if (len > 30) return 30;
  return 10;
}

function scoreDisponibilidade(
  data: Omit<Candidatura, "id" | "criadoEm" | "status">
): number {
  let score = 30;
  const ded = data.dedicacao.toLowerCase();
  if (ded.includes("integral") || ded.includes("100%") || ded.includes("full"))
    score += 40;
  else if (ded.includes("parcial") || ded.includes("50%")) score += 20;

  const prazo = data.prazo.toLowerCase();
  if (prazo.includes("imediato") || prazo.includes("1 mês") || prazo.includes("já"))
    score += 30;
  else if (prazo.includes("3") || prazo.includes("curto")) score += 20;
  else score += 10;

  return Math.min(score, 100);
}
