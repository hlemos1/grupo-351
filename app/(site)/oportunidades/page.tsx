import { prisma } from "@/lib/prisma";
import { Lightbulb, Building2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oportunidades — GRUPO +351",
  description: "Franquias, investimentos, parcerias e oportunidades de expansão no ecossistema +351.",
};

const tipoColors: Record<string, string> = {
  franquia: "bg-purple-50 text-purple-700",
  investimento: "bg-emerald-50 text-emerald-700",
  parceria: "bg-blue-50 text-blue-700",
  fornecedor: "bg-amber-50 text-amber-700",
  expansao: "bg-rose-50 text-rose-700",
};

async function getOpportunities() {
  try {
    return await prisma.opportunity.findMany({
      where: { status: "aberta" },
      include: {
        company: { select: { slug: true, nome: true, verificada: true } },
      },
      orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function OportunidadesPage() {
  const opps = await getOpportunities();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-[#0a1628] to-[#111d2e] pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Oportunidades
          </h1>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Franquias, investimentos, parcerias e expansão. Encontre a sua.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {opps.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma oportunidade publicada ainda.</p>
            <Link href="/register" className="text-amber-600 text-sm mt-2 inline-block hover:underline">
              Crie uma conta e publique a primeira
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {opps.map((opp) => (
              <div
                key={opp.id}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{opp.titulo}</h3>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${tipoColors[opp.tipo] || "bg-gray-50 text-gray-600"}`}>
                    {opp.tipo}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{opp.descricao}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <Link href={`/empresas/${opp.company.slug}`} className="flex items-center gap-1 hover:text-amber-600 transition-colors">
                      <Building2 className="w-3 h-3" /> {opp.company.nome}
                    </Link>
                    {opp.localizacao && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {opp.localizacao}
                      </span>
                    )}
                  </div>
                  {opp.budget && (
                    <span className="text-xs font-medium text-amber-600">{opp.budget}</span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50">
                  <Link
                    href="/register"
                    className="text-xs text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors"
                  >
                    Demonstrar interesse <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
