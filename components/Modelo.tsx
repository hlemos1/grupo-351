"use client";

import { Lightbulb, Building2, Handshake, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const etapas = [
  {
    step: "01",
    title: "Identificacao",
    subtitle: "de oportunidade",
    description: "Analisamos mercados e identificamos oportunidades reais de negocio com potencial de escala.",
    icon: Lightbulb,
    gradient: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-500",
  },
  {
    step: "02",
    title: "Estruturacao",
    subtitle: "do projeto",
    description: "Desenhamos o modelo de negocio, estrategia comercial e estrutura societaria otimizada.",
    icon: Building2,
    gradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    step: "03",
    title: "Joint Venture",
    subtitle: "com operadores",
    description: "Trazemos parceiros especialistas para operar o negocio e crescer juntos com skin in the game.",
    icon: Handshake,
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-500",
  },
];

export function Modelo() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="modelo" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Como Funciona
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1]">
              Nosso modelo de negocio
            </h2>
          </div>
          <p className="text-muted text-lg leading-[1.7] max-w-md tracking-[-0.006em]">
            Tres etapas claras. Complementaridade de competencias. Negocios reais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {etapas.map(({ step, title, subtitle, description, icon: Icon, gradient, iconColor }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease }}
              className="relative"
            >
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-5 h-5 rounded-full bg-white border border-black/[0.06] flex items-center justify-center shadow-sm shadow-black/[0.03]">
                    <ArrowRight className="w-2.5 h-2.5 text-accent" />
                  </div>
                </div>
              )}

              <div className="group bg-[#f8f9fb] rounded-2xl p-8 h-full border border-black/[0.04] hover:shadow-xl hover:shadow-black/[0.03] hover:border-black/[0.06] transition-all duration-500">
                <span className="text-5xl font-bold text-black/[0.04] font-display block mb-6 tracking-[-0.03em]">
                  {step}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-[-0.015em]">
                  {title}
                </h3>
                <p className="text-accent text-[12px] font-semibold tracking-wide uppercase mb-3">{subtitle}</p>
                <p className="text-muted text-[14px] leading-[1.7]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
