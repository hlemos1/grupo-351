"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Tag,
  BarChart3,
  Store,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Termo, Artigo } from "@/lib/conhecimento-types";

const categoriaIcons = {
  conceito: Lightbulb,
  marca: Store,
  modelo: Tag,
  metrica: BarChart3,
};

const categoriaLabels = {
  conceito: "Conceito",
  marca: "Marca",
  modelo: "Modelo",
  metrica: "Métrica",
};

const categoriaCores = {
  conceito: "bg-accent/10 text-accent",
  marca: "bg-success/10 text-success",
  modelo: "bg-warning/10 text-warning",
  metrica: "bg-primary/10 text-primary",
};

const artigoCategoriaLabels = {
  tese: "Tese",
  modelo: "Modelo",
  case: "Case",
  guia: "Guia",
};

export function ConhecimentoPage({ glossario, artigos }: { glossario: Termo[]; artigos: Artigo[] }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("todas");
  const [expandedTermo, setExpandedTermo] = useState<string | null>(null);

  const filteredGlossario = glossario.filter((t) => {
    if (filterCat !== "todas" && t.categoria !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.termo.toLowerCase().includes(q) ||
        t.definicao.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredArtigos = artigos.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        a.titulo.toLowerCase().includes(q) ||
        a.resumo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const destaques = artigos.filter((a) => a.destaque);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Base de Conhecimento
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-primary font-display mb-4">
              Glossário e Teses
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-3xl">
              Entenda os conceitos, termos e modelos que fundamentam o
              ecossistema FIGITAL do Grupo +351.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Buscar termos, conceitos ou artigos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Articles destaque */}
      {!search && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <AnimatedSection>
              <h2 className="text-xl font-bold text-foreground font-display mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Artigos em destaque
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {destaques.map((artigo) => (
                <AnimatedSection key={artigo.slug}>
                  <a
                    href={`/conhecimento/${artigo.slug}`}
                    className="group block bg-surface rounded-2xl border border-border p-8 hover:border-accent/20 hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <span className="text-[10px] font-medium text-accent bg-accent/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {artigoCategoriaLabels[artigo.categoria]}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">
                      {artigo.titulo}
                    </h3>
                    <p className="text-muted leading-relaxed mb-4">
                      {artigo.resumo}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group-hover:underline">
                      Ler artigo
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </AnimatedSection>
              ))}
            </div>

            {/* All articles */}
            {filteredArtigos.length > destaques.length && (
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {filteredArtigos
                  .filter((a) => !a.destaque)
                  .map((artigo) => (
                    <a
                      key={artigo.slug}
                      href={`/conhecimento/${artigo.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/20 hover:bg-surface transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
                          {artigoCategoriaLabels[artigo.categoria]}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                          {artigo.titulo}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
                    </a>
                  ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Glossário */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <h2 className="text-xl font-bold text-foreground font-display">
                Glossário FIGITAL
              </h2>
              <div className="flex gap-2">
                {["todas", "conceito", "marca", "modelo", "metrica"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                      filterCat === cat
                        ? "bg-primary text-white"
                        : "bg-white text-muted border border-border hover:border-accent/20"
                    }`}
                  >
                    {cat === "todas" ? "Todas" : categoriaLabels[cat as keyof typeof categoriaLabels]}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="space-y-2">
            {filteredGlossario.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-8 text-center">
                <p className="text-muted">Nenhum termo encontrado</p>
              </div>
            ) : (
              filteredGlossario.map((termo) => {
                const Icon = categoriaIcons[termo.categoria];
                const isOpen = expandedTermo === termo.slug;

                return (
                  <div
                    key={termo.slug}
                    className="bg-white rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedTermo(isOpen ? null : termo.slug)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${categoriaCores[termo.categoria]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{termo.termo}</h3>
                      </div>
                      <span className="text-[10px] text-muted uppercase tracking-wider hidden md:block">
                        {categoriaLabels[termo.categoria]}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0">
                            <div className="pl-12">
                              <p className="text-muted leading-relaxed text-sm">
                                {termo.definicao}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-primary font-display mb-4">
              Pronto para aplicar estes conceitos?
            </h2>
            <p className="text-muted mb-8">
              Explore os modelos de parceria ou candidate-se diretamente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/parceiros"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-all"
              >
                Ver modelos de JV
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/ecossistema"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
              >
                Ver mapa do ecossistema
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
