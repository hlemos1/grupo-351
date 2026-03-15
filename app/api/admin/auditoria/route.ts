import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/rbac";

export async function GET(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const url = new URL(req.url);
  const recurso = url.searchParams.get("recurso");
  const adminId = url.searchParams.get("adminId");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);

  const where: Record<string, unknown> = {};
  if (recurso) where.recurso = recurso;
  if (adminId) where.adminId = adminId;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { criadoEm: "desc" },
    take: limit,
  });

  return NextResponse.json(logs.map((l) => ({
    id: l.id,
    acao: l.acao,
    recurso: l.recurso,
    resourceId: l.resourceId,
    adminId: l.adminId,
    adminNome: l.adminNome,
    detalhes: l.detalhes,
    ip: l.ip,
    criadoEm: l.criadoEm.toISOString(),
  })));
}
