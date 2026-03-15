"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const ideal = [
  "Operadores com experiência no setor e vontade de empreender em Portugal",
  "Empresários que querem expandir para o mercado europeu",
  "Profissionais técnicos com know-how para operar um negócio estruturado",
  "Investidores que buscam participação ativa em projetos reais",
];

const naoIdeal = [
  "Quem busca apenas investimento passivo sem envolvimento",
  "Projetos sem viabilidade comercial clara",
  "Propostas sem comprometimento de longo prazo",
];

export function ParaQuem() {
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
            Perfil de Parceiro
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-6">
            Para quem é o Grupo +351
          </h2>
          <p className="text-muted text-lg leading-[1.7] tracking-[-0.006em]">
            Buscamos parceiros que queiram construir junto. Não oferecemos
            oportunidades de investimento passivo — oferecemos sociedade em negócios reais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease }}
          >
            <div className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 h-full hover:shadow-xl hover:shadow-emerald-500/[0.03] hover:border-emerald-500/[0.08] transition-all duration-500">
              <h3 className="text-lg font-semibold text-foreground mb-7 flex items-center gap-3 tracking-[-0.01em]">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.08] flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                Perfil ideal
              </h3>
              <div className="space-y-4">
                {ideal.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-[18px] h-[18px] text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted text-[14px] leading-[1.65]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7, ease }}
          >
            <div className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 h-full hover:shadow-xl hover:shadow-rose-500/[0.03] hover:border-rose-500/[0.08] transition-all duration-500">
              <h3 className="text-lg font-semibold text-foreground mb-7 flex items-center gap-3 tracking-[-0.01em]">
                <div className="w-9 h-9 rounded-xl bg-rose-500/[0.08] flex items-center justify-center">
                  <XCircle className="w-4.5 h-4.5 text-rose-500" />
                </div>
                Não é para quem busca
              </h3>
              <div className="space-y-4">
                {naoIdeal.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease }}
                    className="flex items-start gap-3"
                  >
                    <XCircle className="w-[18px] h-[18px] text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-muted text-[14px] leading-[1.65]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
