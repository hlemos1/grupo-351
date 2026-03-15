import { NextResponse } from "next/server";
import { getCandidaturas, getContatos } from "@/lib/db";
import { getProjetos } from "@/lib/projetos";
import { getGlossario, getArtigos } from "@/lib/conhecimento";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [candidaturas, contatos, allProjetos, glossario, artigos, userCount, companyCount, oppCount, matchCount, subCount, activeSubCount, projectCount] = await Promise.all([
    getCandidaturas(),
    getContatos(),
    getProjetos(),
    getGlossario(),
    getArtigos(),
    prisma.user.count(),
    prisma.company.count(),
    prisma.opportunity.count(),
    prisma.match.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.platformProject.count(),
  ]);

  // Growth: users e companies criados nos ultimos 7 dias
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const [newUsers7d, newCompanies7d, newOpps7d, closedDeals] = await Promise.all([
    prisma.user.count({ where: { criadoEm: { gte: seteDiasAtras } } }),
    prisma.company.count({ where: { criadoEm: { gte: seteDiasAtras } } }),
    prisma.opportunity.count({ where: { criadoEm: { gte: seteDiasAtras } } }),
    prisma.match.count({ where: { status: "fechado" } }),
  ]);

  const stats = {
    candidaturas: {
      total: candidaturas.length,
      novas: candidaturas.filter((c) => c.status === "nova").length,
      emAnalise: candidaturas.filter((c) => c.status === "em-analise").length,
      entrevista: candidaturas.filter((c) => c.status === "entrevista").length,
      aprovadas: candidaturas.filter((c) => c.status === "aprovada").length,
      recusadas: candidaturas.filter((c) => c.status === "recusada").length,
    },
    contatos: {
      total: contatos.length,
      naoLidos: contatos.filter((c) => !c.lido).length,
    },
    projetos: {
      ideacao: allProjetos.filter((p) => p.status === "Ideação").length,
      emEstruturacao: allProjetos.filter((p) => p.status === "Em estruturação").length,
      emDesenvolvimento: allProjetos.filter((p) => p.status === "Em desenvolvimento").length,
      emOperacao: allProjetos.filter((p) => p.status === "Em operação").length,
      consolidado: allProjetos.filter((p) => p.status === "Consolidado").length,
    },
    conhecimento: {
      termos: glossario.length,
      artigos: artigos.length,
    },
    plataforma: {
      users: userCount,
      companies: companyCount,
      opportunities: oppCount,
      matches: matchCount,
      subscriptions: subCount,
      activeSubscriptions: activeSubCount,
      projects: projectCount,
      closedDeals,
      growth7d: {
        users: newUsers7d,
        companies: newCompanies7d,
        opportunities: newOpps7d,
      },
    },
  };

  return NextResponse.json(stats);
}
