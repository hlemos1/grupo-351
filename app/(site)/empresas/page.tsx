import Link from "next/link";
import { Building2, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Empresas — GRUPO +351",
  description: "Conheça as empresas do ecossistema +351. Encontre parceiros, fornecedores e oportunidades.",
};

interface Company {
  slug: string;
  nome: string;
  tagline: string | null;
  setor: string;
  pais: string;
  cidade: string | null;
  estagio: string;
  interesses: string[];
  verificada: boolean;
}

async function getCompanies(): Promise<Company[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const companies = await prisma.company.findMany({
      where: { ativa: true },
      select: {
        slug: true, nome: true, tagline: true, setor: true,
        pais: true, cidade: true, estagio: true, interesses: true, verificada: true,
      },
      orderBy: { criadoEm: "desc" },
      take: 50,
    });
    return companies;
  } catch {
    return [];
  }
}

const estagioLabel: Record<string, string> = {
  ideacao: "Ideação",
  validacao: "Validação",
  operando: "Em operação",
  escala: "Escala",
  consolidado: "Consolidado",
};

export default async function EmpresasPage() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-[#0a1628] to-[#111d2e] pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Empresas do ecossistema
          </h1>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Empresas, parceiros e operadores conectados na rede +351.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma empresa cadastrada ainda.</p>
            <Link href="/register" className="text-amber-600 text-sm mt-2 inline-block hover:underline">
              Seja a primeira
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <Link
                key={c.slug}
                href={`/empresas/${c.slug}`}
                className="group border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  {c.verificada && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {c.nome}
                </h3>
                {c.tagline && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{c.tagline}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className="bg-gray-50 px-2 py-0.5 rounded">{c.setor}</span>
                  <span className="bg-gray-50 px-2 py-0.5 rounded">{estagioLabel[c.estagio] || c.estagio}</span>
                </div>
                {c.cidade && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-300">
                    <MapPin className="w-3 h-3" />
                    {c.cidade}, {c.pais}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-4 text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver perfil <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
