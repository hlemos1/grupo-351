import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBillingPortalSession } from "@/lib/stripe";

// POST — abrir Stripe billing portal
export async function POST() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const company = await prisma.company.findUnique({
    where: { ownerId: session.id },
    include: { subscription: true },
  });

  if (!company?.subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "Sem assinatura ativa" }, { status: 404 });
  }

  try {
    const url = await createBillingPortalSession(
      company.subscription.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL || "https://grupo351.com"}/dashboard/plano`
    );
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[billing-portal]", err);
    return NextResponse.json({ error: "Erro ao abrir portal" }, { status: 500 });
  }
}
