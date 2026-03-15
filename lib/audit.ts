import { prisma } from "./prisma";
import { headers } from "next/headers";

interface AuditEntry {
  acao: string;
  recurso: string;
  resourceId?: string;
  adminId: string;
  adminNome: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detalhes?: any;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || null;

    await prisma.auditLog.create({
      data: {
        acao: entry.acao,
        recurso: entry.recurso,
        resourceId: entry.resourceId || null,
        adminId: entry.adminId,
        adminNome: entry.adminNome,
        detalhes: entry.detalhes ?? undefined,
        ip,
      },
    });
  } catch {
    // Audit log failure should not break the request
    console.error("[audit] Failed to log:", entry);
  }
}
