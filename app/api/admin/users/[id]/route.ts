import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, hasPermission } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      company: true,
      memberships: { include: { company: { select: { id: true, nome: true, slug: true } } } },
      _count: { select: { matchesFrom: true, matchesTo: true, opportunities: true, messages: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    avatar: user.avatar,
    ativo: user.ativo,
    googleId: !!user.googleId,
    criadoEm: user.criadoEm.toISOString(),
    ultimoLogin: user.ultimoLogin?.toISOString() || null,
    company: user.company,
    memberships: user.memberships.map((m) => ({ role: m.role, company: m.company })),
    _count: {
      matches: user._count.matchesFrom + user._count.matchesTo,
      opportunities: user._count.opportunities,
      messages: user._count.messages,
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(admin.role, "update")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowed: Record<string, boolean> = { ativo: true, role: true };
  const data: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    if (allowed[key]) data[key] = val;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo válido" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({ where: { id }, data });

    await logAudit({
      acao: "update",
      recurso: "user",
      resourceId: id,
      adminId: admin.id,
      adminNome: admin.nome,
      detalhes: data,
    });

    return NextResponse.json({ id: updated.id, ativo: updated.ativo, role: updated.role });
  } catch {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
}
