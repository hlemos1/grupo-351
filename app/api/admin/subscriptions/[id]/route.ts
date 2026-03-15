import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, hasPermission } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

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

  const allowed: Record<string, boolean> = { plano: true, status: true, cancelAtPeriodEnd: true };
  const data: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    if (allowed[key]) data[key] = val;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo válido" }, { status: 400 });
  }

  try {
    const updated = await prisma.subscription.update({ where: { id }, data });

    await logAudit({
      acao: "update",
      recurso: "subscription",
      resourceId: id,
      adminId: admin.id,
      adminNome: admin.nome,
      detalhes: data,
    });

    return NextResponse.json({ id: updated.id, plano: updated.plano, status: updated.status });
  } catch {
    return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 404 });
  }
}
