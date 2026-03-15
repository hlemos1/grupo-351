import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — listar pagamentos/faturas da empresa
export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const company = await prisma.company.findUnique({
    where: { ownerId: session.id },
  });

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: { companyId: company.id },
    orderBy: { criadoEm: "desc" },
    take: 50,
  });

  return NextResponse.json({
    invoices: payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      tipo: p.tipo,
      descricao: p.descricao,
      criadoEm: p.criadoEm.toISOString(),
    })),
  });
}
