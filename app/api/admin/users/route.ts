import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/rbac";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      company: { select: { id: true, nome: true, slug: true, verificada: true } },
      _count: { select: { matchesFrom: true, matchesTo: true, opportunities: true } },
    },
  });

  const data = users.map((u) => ({
    id: u.id,
    email: u.email,
    nome: u.nome,
    role: u.role,
    avatar: u.avatar,
    ativo: u.ativo,
    googleId: !!u.googleId,
    criadoEm: u.criadoEm.toISOString(),
    ultimoLogin: u.ultimoLogin?.toISOString() || null,
    company: u.company ? { id: u.company.id, nome: u.company.nome, slug: u.company.slug, verificada: u.company.verificada } : null,
    _count: { matches: u._count.matchesFrom + u._count.matchesTo, opportunities: u._count.opportunities },
  }));

  return NextResponse.json(data);
}
