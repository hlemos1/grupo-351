import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, MapPin, Globe, Linkedin, CheckCircle2, Lightbulb, Calendar } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug, ativa: true },
    select: { nome: true, tagline: true },
  });
  if (!company) return { title: "Empresa não encontrada" };
  return {
    title: `${company.nome} — GRUPO +351`,
    description: company.tagline || `${company.nome} no ecossistema +351.`,
  };
}

const estagioLabel: Record<string, string> = {
  ideacao: "Ideação", validacao: "Validação", operando: "Em operação",
  escala: "Escala", consolidado: "Consolidado",
};

export default async function EmpresaPerfilPage({ params }: Props) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug, ativa: true },
    include: {
      opportunities: {
        where: { status: "aberta" },
        orderBy: { criadoEm: "desc" },
        take: 10,
      },
    },
  });

  if (!company) notFound();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-[#0a1628] to-[#111d2e] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white/60" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{company.nome}</h1>
                {company.verificada && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
              </div>
              {company.tagline && (
                <p className="text-white/50 mt-1">{company.tagline}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-white/[0.06] text-white/60 text-xs px-3 py-1.5 rounded-full">{company.setor}</span>
            <span className="bg-white/[0.06] text-white/60 text-xs px-3 py-1.5 rounded-full">{estagioLabel[company.estagio] || company.estagio}</span>
            {company.cidade && (
              <span className="bg-white/[0.06] text-white/60 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {company.cidade}, {company.pais}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Sobre */}
        {company.descricao && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{company.descricao}</p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4">
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors">
              <Globe className="w-4 h-4" /> Website
            </a>
          )}
          {company.linkedin && (
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>

        {/* Interesses */}
        {company.interesses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Interesses</h2>
            <div className="flex flex-wrap gap-2">
              {company.interesses.map((tag) => (
                <span key={tag} className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidades */}
        {company.opportunities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Oportunidades abertas</h2>
            <div className="space-y-3">
              {company.opportunities.map((opp) => (
                <div key={opp.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <h3 className="font-medium text-gray-900">{opp.titulo}</h3>
                    </div>
                    <span className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded">{opp.tipo}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{opp.descricao}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-300">
                    <Calendar className="w-3 h-3" />
                    {new Date(opp.criadoEm).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm mb-4">Quer conectar com {company.nome}?</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-amber-500 transition-all"
          >
            Criar conta na plataforma
          </Link>
        </div>
      </section>
    </main>
  );
}
