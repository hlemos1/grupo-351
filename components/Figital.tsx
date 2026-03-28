"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const camadas = [
  {
    num: "01",
    title: "Operacao Fisica",
    subtitle: "Onde o valor nasce",
    items: ["Strike Studio — 130+ alunos, boutique MMA", "FarmLab 3D — producao e prototipagem", "Sede em Cascais — escritorio operacional"],
    desc: "Negocios reais com clientes reais. O fisico gera caixa e dados.",
    accent: "from-blue-500/10 to-blue-600/5",
    dot: "bg-blue-500",
  },
  {
    num: "02",
    title: "Inteligencia Digital",
    subtitle: "Onde o dado vira decisao",
    items: ["Nexial GSO — consultoria IA com metodo proprio", "Tecnologia proprietaria — automacoes e agentes", "Dados de operacao alimentam estrategia"],
    desc: "IA e software transformam operacao em inteligencia competitiva.",
    accent: "from-violet-500/10 to-violet-600/5",
    dot: "bg-violet-500",
  },
  {
    num: "03",
    title: "Comercio Global",
    subtitle: "Onde a escala acontece",
    items: ["Nexial Global — sourcing China direto", "Nexial E-Brand — e-commerce e marcas proprias", "Supply chain proprietaria Europa-Asia"],
    desc: "Conectamos producao, distribuicao e mercado global.",
    accent: "from-emerald-500/10 to-emerald-600/5",
    dot: "bg-emerald-500",
  },
];

export function Figital() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mb-16"
        >
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
            Tese Central
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-6">
            Fisico + Digital{" "}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              por arquitetura
            </span>
          </h2>
          <p className="text-muted text-lg leading-[1.7] mb-4 tracking-[-0.006em]">
            Nao separamos fisico de digital. Cada operacao fisica gera dados.
            Cada sistema digital melhora a operacao. A governanca transforma tudo em decisao.
          </p>
          <p className="text-foreground text-lg leading-[1.7] font-medium tracking-[-0.006em]">
            Concorrentes copiam produto. Nao copiam o sistema que o criou.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {camadas.map(({ num, title, subtitle, items, desc, accent, dot }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease }}
            >
              <div className="group bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 h-full hover:shadow-xl hover:shadow-black/[0.03] hover:border-black/[0.06] transition-all duration-500">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mb-5`}>
                  <span className="text-[15px] font-bold text-foreground/60 font-display">{num}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-[-0.015em] mb-1">{title}</h3>
                <p className="text-accent text-[12px] font-semibold tracking-wide uppercase mb-4">{subtitle}</p>
                <p className="text-muted text-[14px] leading-[1.65] mb-5">{desc}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="text-muted text-[13px] flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0 opacity-60`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
