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
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, nome: true, email: true, avatar: true } },
      members: {
        include: { user: { select: { id: true, nome: true, email: true, avatar: true } } },
      },
      opportunities: {
        orderBy: { criadoEm: "desc" },
        take: 10,
        select: { id: true, titulo: true, tipo: true, status: true, criadoEm: true },
      },
      subscription: true,
      _count: { select: { opportunities: true, members: true, projects: true } },
    },
  });

  if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

  return NextResponse.json({
    ...company,
    criadoEm: company.criadoEm.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
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

  const allowed: Record<string, boolean> = { verificada: true, ativa: true };
  const data: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    if (allowed[key]) data[key] = val;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo válido" }, { status: 400 });
  }

  try {
    const updated = await prisma.company.update({ where: { id }, data });

    await logAudit({
      acao: "update",
      recurso: "company",
      resourceId: id,
      adminId: admin.id,
      adminNome: admin.nome,
      detalhes: data,
    });

    return NextResponse.json({ id: updated.id, verificada: updated.verificada, ativa: updated.ativa });
  } catch {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }
}
