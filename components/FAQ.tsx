"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "O que e o Grupo +351?",
    a: "Somos um venture builder luso-brasileiro sediado em Cascais, Portugal. Criamos, operamos e escalamos empresas reais que integram operacoes fisicas, tecnologia digital e supply chain global. Hoje temos 5 empresas ativas em areas como consultoria IA, fitness, e-commerce, sourcing China e impressao 3D.",
  },
  {
    q: "O que e uma Joint Venture no +351?",
    a: "E uma parceria societaria real. O grupo entra com marca, metodo, capital e governanca. O operador entra com execucao e know-how. Estruturas variam de 50/50 a 75/25 com vesting progressivo. Cada empresa tem seu modelo — veja detalhes no Portal do Parceiro (/parceiros).",
  },
  {
    q: "Preciso ter capital para ser parceiro?",
    a: "Depende do modelo e da vertical. Existem modelos com vesting progressivo onde a participacao e conquistada com performance, sem necessidade de capital inicial. Para modelos com investimento, os valores variam por empresa.",
  },
  {
    q: "Como me candidato?",
    a: "Atraves do formulario estruturado em /aplicar. Sao 5 etapas: perfil pessoal, experiencia, modelo de interesse, proposta e aceite de NDA preliminar. Candidaturas sao analisadas pela equipa de governanca em ate 5 dias uteis.",
  },
  {
    q: "Voces atuam apenas em Portugal?",
    a: "Estamos sediados em Cascais, Portugal, mas operamos globalmente. Sourcing direto na China via Nexial Global, marcas com raizes no Brasil, distribuicao europeia e supply chain Asia-Europa. Veja o mapa completo em /ecossistema.",
  },
  {
    q: "Como as empresas do ecossistema se conectam?",
    a: "Cada empresa e um no na rede. A operacao fisica (Strike Studio, FarmLab 3D) gera caixa e dados. A inteligencia digital (Nexial GSO) transforma dados em decisao. O comercio global (Nexial Global, E-Brand) conecta producao a mercado. Tudo se alimenta mutuamente.",
  },
  {
    q: "Qual a diferenca entre operador e investidor?",
    a: "Operador executa o dia-a-dia do negocio e conquista participacao via vesting. Investidor entra com capital e tem retorno proporcional. O modelo 'ambos' combina os dois — voce opera e investe. Cada perfil tem acesso a modelos diferentes.",
  },
  {
    q: "O Grupo +351 participa da operacao diaria?",
    a: "Depende da vertical. Nas empresas 100% do grupo (Nexial GSO, E-Brand), sim. Nas joint ventures (Strike Studio, FarmLab 3D, Nexial Global), a operacao e do parceiro. O grupo fornece estrategia, governanca, conexao com o ecossistema e conselho mensal.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.04] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
      >
        <span className="text-foreground text-[15px] font-medium pr-8 group-hover:text-primary transition-colors duration-300 tracking-[-0.01em]">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-7 h-7 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:bg-accent/[0.08] transition-colors duration-300"
        >
          <Plus className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors duration-300" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-muted text-[14px] leading-[1.75] pb-6 pr-12">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="faq" className="py-28 bg-[#f8f9fb]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-14"
        >
          <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
            Perguntas Frequentes
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1]">
            Dúvidas comuns
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7, ease }}
          className="bg-white rounded-2xl border border-black/[0.04] p-6 md:p-8 shadow-sm shadow-black/[0.02]"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} {...faq} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
