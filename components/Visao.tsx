"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const valores = [
  { title: "Negocio antes do discurso", desc: "Resultado valida narrativa" },
  { title: "Longo prazo nao e slogan", desc: "Decisoes pensadas em ciclos" },
  { title: "Governanca e vantagem", desc: "Regra clara, papel definido" },
  { title: "Marca e ativo", desc: "Caixa, reputacao e recorrencia" },
  { title: "Execucao disciplinada", desc: "Boa ideia sem execucao e hobby" },
  { title: "Internacional por natureza", desc: "Pensamento global, controle central" },
];

export function Visao() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-primary relative overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0f2d4a]" />
      <motion.div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-accent/[0.04] blur-[140px] rounded-full"
        animate={{ x: [0, 80, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
            Valores
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-white font-display tracking-[-0.025em] leading-[1.1] mb-4">
            O que nos guia
          </h2>
          <p className="text-white/50 text-lg mb-14 tracking-[-0.006em]">
            Cultura nao se discute, se vive. Quem vive, fica. Quem forca encaixe, sai.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
          {valores.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease }}
            >
              <div className="group bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-500 cursor-default h-full">
                <p className="text-white text-[14px] font-semibold mb-1.5 tracking-[-0.01em]">{title}</p>
                <p className="text-white/35 text-[13px] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <p className="text-white/30 text-[14px] italic leading-relaxed tracking-[-0.006em]">
            &ldquo;Enquanto outros contam historias, o Grupo +351 constroi sistemas.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
