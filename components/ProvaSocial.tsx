"use client";

import { AnimatedSection } from "./AnimatedSection";
import { Award, TrendingUp, Store, Users, Quote } from "lucide-react";

const metricas = [
  { icon: Store, value: "200+", label: "Unidades no Brasil" },
  { icon: TrendingUp, value: "R$220M+", label: "Faturamento anual" },
  { icon: Users, value: "800k+", label: "Pedidos no super-app" },
  { icon: Award, value: "5x", label: "Selo ABF de excelência" },
];

const depoimentos = [
  {
    texto:
      "O modelo de Joint Venture do Grupo +351 nos deu acesso a uma estrutura que levaríamos anos para construir sozinhos. A governança e o método fazem toda a diferença.",
    autor: "Parceiro operador",
    marca: "Rede de delivery",
  },
  {
    texto:
      "A experiência do Henrique e do time em escalar operações de food service é real e comprovada. Não é teoria — são 200+ unidades funcionando.",
    autor: "Investidor parceiro",
    marca: "Ecossistema FIGITAL",
  },
];

export function ProvaSocial() {
  return (
    <section className="py-20 bg-[#f8f9fb]">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
            Resultados comprovados
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-4">
            Números que falam por si
          </h2>
          <p className="text-muted text-lg leading-relaxed max-w-3xl mb-12">
            O Grupo +351 é construído sobre uma base sólida de resultados reais
            no Brasil — agora expandindo para Portugal e Europa.
          </p>
        </AnimatedSection>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metricas.map(({ icon: Icon, value, label }, i) => (
            <AnimatedSection key={label} delay={i * 0.08}>
              <div className="bg-white rounded-2xl border border-black/[0.04] p-6 text-center hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-primary/[0.05] flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary font-display tracking-tight">
                  {value}
                </p>
                <p className="text-muted text-[13px] mt-1">{label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Depoimentos */}
        <div className="grid md:grid-cols-2 gap-6">
          {depoimentos.map((dep, i) => (
            <AnimatedSection key={i} delay={0.1 + i * 0.1}>
              <div className="bg-white rounded-2xl border border-black/[0.04] p-8 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-500">
                <Quote className="w-6 h-6 text-accent/30 mb-4" />
                <p className="text-foreground text-[15px] leading-[1.75] mb-6 italic">
                  &ldquo;{dep.texto}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {dep.autor}
                  </p>
                  <p className="text-[12px] text-muted">{dep.marca}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
