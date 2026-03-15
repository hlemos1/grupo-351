import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — analytics do dashboard
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const company = await prisma.company.findUnique({ where: { ownerId: session.id } });

  // Métricas da plataforma (visão do usuário)
  const [
    totalCompanies,
    totalOpportunities,
    myMatches,
    myProjects,
    recentActivity,
  ] = await Promise.all([
    prisma.company.count({ where: { ativa: true } }),
    prisma.opportunity.count({ where: { status: "aberta" } }),
    prisma.match.count({
      where: { OR: [{ fromUserId: session.id }, { toUserId: session.id }] },
    }),
    company
      ? prisma.platformProject.count({
          where: { members: { some: { companyId: company.id } } },
        })
      : 0,
    // Últimos matches recebidos
    prisma.match.findMany({
      where: { toUserId: session.id, status: "sugerido" },
      include: {
        opportunity: { select: { titulo: true, tipo: true } },
        fromUser: { select: { nome: true } },
      },
      orderBy: { criadoEm: "desc" },
      take: 5,
    }),
  ]);

  // Breakdown de matches por status
  const matchesByStatus = await prisma.match.groupBy({
    by: ["status"],
    where: { OR: [{ fromUserId: session.id }, { toUserId: session.id }] },
    _count: true,
  });

  return NextResponse.json({
    platform: {
      companies: totalCompanies,
      opportunities: totalOpportunities,
    },
    personal: {
      matches: myMatches,
      projects: myProjects,
      matchesByStatus: matchesByStatus.reduce(
        (acc, m) => ({ ...acc, [m.status]: m._count }),
        {} as Record<string, number>
      ),
    },
    pendingMatches: recentActivity,
  });
}
