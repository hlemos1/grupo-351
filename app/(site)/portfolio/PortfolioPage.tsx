"use client";

import { motion } from "framer-motion";
import {
  Printer,
  ShoppingBag,
  Globe,
  Dumbbell,
  Brain,
  ArrowRight,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { Projeto } from "@/lib/projetos";

const iconMap: Record<string, typeof Printer> = {
  printer: Printer,
  "shopping-bag": ShoppingBag,
  globe: Globe,
  dumbbell: Dumbbell,
  brain: Brain,
};

export function PortfolioPage({ projetos }: { projetos: Projeto[] }) {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-surface to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Portfólio
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-primary font-display mb-6">
              Nossos negócios
            </h1>
            <p className="text-muted text-xl leading-relaxed max-w-3xl">
              Cada projeto do Grupo +351 nasce de uma oportunidade real de mercado,
              estruturado com disciplina e operado por parceiros especializados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projetos */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-8">
            {projetos.map((projeto, i) => {
              const Icon = iconMap[projeto.icon] || Printer;
              return (
                <AnimatedSection key={projeto.slug} delay={i * 0.1}>
                  <a
                    href={`/portfolio/${projeto.slug}`}
                    className="group block bg-surface rounded-2xl border border-border p-8 md:p-10 hover:shadow-xl hover:border-accent/20 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-foreground">
                              {projeto.name}
                            </h2>
                            <span className="text-xs font-medium text-accent bg-accent/5 px-3 py-1 rounded-full">
                              {projeto.tag}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
                        </div>
                        <p className="text-muted text-lg mb-4">{projeto.tagline}</p>
                        <p className="text-muted leading-relaxed mb-4">
                          {projeto.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                projeto.status === "Em operação"
                                  ? "bg-success"
                                  : projeto.status === "Consolidado"
                                  ? "bg-blue-500"
                                  : projeto.status === "Em desenvolvimento"
                                  ? "bg-warning"
                                  : projeto.status === "Ideação"
                                  ? "bg-purple-400"
                                  : "bg-muted"
                              }`}
                            />
                            <span className="text-muted">{projeto.status}</span>
                          </div>
                          <span className="text-muted">{projeto.mercado}</span>
                          {projeto.parceiro && (
                            <span className="text-muted">
                              Parceiro: {projeto.parceiro}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
              Tem um projeto para propor?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Estamos sempre avaliando novas oportunidades de negócio para o portfólio.
            </p>
            <a
              href="/contato"
              className="group inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
            >
              Proponha uma joint venture
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
