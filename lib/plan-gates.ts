import { prisma } from "./prisma";
import { PLANS, type PlanConfig } from "./stripe";

export interface PlanLimits {
  plan: PlanConfig;
  oportunidades: { used: number; max: number; canCreate: boolean };
  membros: { used: number; max: number; canInvite: boolean };
  matchesIA: boolean;
  apiAccess: boolean;
}

export async function getCompanyLimits(companyId: string): Promise<PlanLimits> {
  const [sub, oppCount, memberCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { companyId } }),
    prisma.opportunity.count({ where: { companyId, status: { in: ["aberta", "em-negociacao"] } } }),
    prisma.companyMember.count({ where: { companyId } }),
  ]);

  const plan = (sub?.status === "active" ? PLANS[sub.plano] : null) || PLANS.free;
  const maxOpps = plan.limites.oportunidades;
  const maxMembros = plan.limites.membros;

  return {
    plan,
    oportunidades: {
      used: oppCount,
      max: maxOpps,
      canCreate: maxOpps === -1 || oppCount < maxOpps,
    },
    membros: {
      used: memberCount,
      max: maxMembros,
      canInvite: maxMembros === -1 || memberCount < maxMembros,
    },
    matchesIA: plan.limites.matchesIA,
    apiAccess: plan.limites.apiAccess,
  };
}

export function formatLimitMessage(resource: string, max: number): string {
  return `O limite do seu plano para ${resource} foi atingido (${max}). Faça upgrade para continuar.`;
}
