import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/rbac";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      company: {
        select: { id: true, nome: true, slug: true, setor: true, owner: { select: { nome: true, email: true } } },
      },
    },
  });

  return NextResponse.json(subscriptions.map((s) => ({
    id: s.id,
    plano: s.plano,
    status: s.status,
    stripeCustomerId: s.stripeCustomerId,
    stripeSubscriptionId: s.stripeSubscriptionId,
    currentPeriodEnd: s.currentPeriodEnd?.toISOString() || null,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    criadoEm: s.criadoEm.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    company: s.company,
  })));
}
