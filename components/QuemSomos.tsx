"use client";

import { Linkedin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const socios = [
  {
    name: "Henrique Lemos",
    initials: "HL",
    role: "Socio Fundador",
    bio: "CEO do Grupo Rao — maior rede de delivery do Brasil com 200+ unidades, 20+ marcas e super-app proprio. Food tech, Web3, IA e expansao internacional.",
    linkedin: "https://www.linkedin.com/in/henrique-lemos-39712b22b/",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Fernando Vieira",
    initials: "FV",
    role: "Socio Fundador",
    bio: "Socio-administrador da Casarao Lustres — referencia em iluminacao decorativa e tecnica no Brasil com mais de 4 decadas de atuacao no Rio de Janeiro.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Herson Rosa",
    initials: "HR",
    role: "Socio Fundador",
    bio: "Administrador da Imperio dos Freios — lider no mercado de autopecas para linha pesada ha mais de 16 anos, referencia na regiao Sudeste do Brasil.",
    gradient: "from-amber-500 to-orange-600",
  },
];

export function QuemSomos() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="quem-somos" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <div className="max-w-3xl">
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Quem Somos
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-8">
              Tres empreendedores,{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                uma visao comum
              </span>
            </h2>
            <p className="text-muted text-lg leading-[1.7] mb-4 tracking-[-0.006em]">
              O Grupo +351 e uma holding empresarial fundada por tres empresarios
              com historico comprovado de criacao, operacao e escala de negocios
              no Brasil e em Portugal.
            </p>
            <p className="text-muted text-lg leading-[1.7] mb-4 tracking-[-0.006em]">
              Nao existimos para testar ideias. Existimos para criar ativos.
              Cada marca precisa gerar caixa, reputacao e recorrencia.
            </p>
            <p className="text-foreground text-lg leading-[1.7] font-medium tracking-[-0.006em]">
              Capital controla a arquitetura. Execucao gera dados.
              Permanencia consolida aprendizado.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mt-16">
          {socios.map((socio, i) => (
            <motion.div
              key={socio.initials}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }}
            >
              <div className="group bg-white rounded-2xl border border-black/[0.04] p-7 h-full hover:shadow-xl hover:shadow-black/[0.04] hover:border-black/[0.06] transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${socio.gradient} flex items-center justify-center text-white font-bold text-[15px] shadow-lg shadow-black/[0.08]`}>
                    {socio.initials}
                  </div>
                  {socio.linkedin ? (
                    <a
                      href={socio.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/[0.12] hover:text-accent transition-colors duration-300 p-1.5 rounded-lg hover:bg-accent/[0.05]"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-lg tracking-[-0.015em] mb-1">
                  {socio.name}
                </h3>
                <p className="text-accent text-[12px] font-semibold tracking-wide uppercase mb-4">{socio.role}</p>
                <p className="text-muted text-[14px] leading-[1.7]">{socio.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="/sobre"
            className="inline-flex items-center gap-1.5 text-accent text-[14px] font-medium hover:underline underline-offset-4 group"
          >
            Ver perfis completos e trajetoria
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
