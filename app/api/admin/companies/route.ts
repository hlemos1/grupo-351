import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/rbac";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const companies = await prisma.company.findMany({
    orderBy: { criadoEm: "desc" },
    include: {
      owner: { select: { id: true, nome: true, email: true } },
      subscription: { select: { plano: true, status: true } },
      _count: { select: { opportunities: true, members: true, projects: true } },
    },
  });

  const data = companies.map((c) => ({
    id: c.id,
    slug: c.slug,
    nome: c.nome,
    tagline: c.tagline,
    setor: c.setor,
    pais: c.pais,
    cidade: c.cidade,
    estagio: c.estagio,
    faturamento: c.faturamento,
    verificada: c.verificada,
    ativa: c.ativa,
    logo: c.logo,
    criadoEm: c.criadoEm.toISOString(),
    owner: c.owner,
    subscription: c.subscription,
    _count: c._count,
  }));

  return NextResponse.json(data);
}
