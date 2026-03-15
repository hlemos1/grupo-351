import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/rbac";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const projects = await prisma.platformProject.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      match: {
        select: {
          id: true,
          status: true,
          opportunity: { select: { titulo: true, tipo: true } },
          fromUser: { select: { id: true, nome: true } },
          toUser: { select: { id: true, nome: true } },
        },
      },
      members: {
        include: { company: { select: { id: true, nome: true, slug: true } } },
      },
      _count: { select: { tasks: true } },
    },
  });

  const data = projects.map((p) => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao ? p.descricao.substring(0, 200) : null,
    status: p.status,
    criadoEm: p.criadoEm.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    match: p.match,
    members: p.members.map((m) => ({ role: m.role, company: m.company })),
    _count: p._count,
  }));

  return NextResponse.json(data);
}
