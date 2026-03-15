"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "O que é FIGITAL?",
    a: "FIGITAL é a arquitetura central do Grupo +351 — a integração estrutural entre operações físicas, plataformas digitais e software proprietário. Não é tendência, é infraestrutura. O físico gera sinais, o digital organiza, a governança transforma em decisão. Saiba mais na nossa Base de Conhecimento (/conhecimento).",
  },
  {
    q: "O que é uma Joint Venture no +351?",
    a: "É uma parceria societária real. A holding entra com marca, método, capital e governança. O operador entra com execução e know-how. Estruturas variam de 50/50 a 70/30 com vesting. Cada marca tem seu modelo — veja detalhes no Portal do Parceiro (/parceiros).",
  },
  {
    q: "Preciso ter capital para ser parceiro?",
    a: "Depende do modelo. Forge and Flow 3D começa com 5.000 EUR. Purple Party pode chegar a 100.000 EUR. Para operadores sem capital, existem modelos com vesting progressivo onde a participação é conquistada com performance. Use o simulador em /parceiros para estimar.",
  },
  {
    q: "Como me candidato?",
    a: "Através do formulário estruturado em /aplicar. São 5 etapas: perfil pessoal, experiência, modelo de interesse, proposta e aceite de NDA preliminar. Candidaturas são analisadas pela equipa de governança em até 5 dias úteis.",
  },
  {
    q: "Vocês atuam apenas em Portugal?",
    a: "Estamos sediados em Cascais, Portugal, mas o ecossistema é global. Sourcing da China (Purple Party), marcas validadas no Brasil, distribuição europeia. Veja o mapa completo em /ecossistema.",
  },
  {
    q: "Como as 7 marcas se conectam?",
    a: "Cada marca é um nó no ecossistema FIGITAL. Sensores (Veeenha, Ruptfy, Forge and Flow) captam dados. Neurônios (Córtex FC, Long View, Purple Party) processam. Distribuição (lojas, app, franquias) retroalimenta. Visualize tudo em /ecossistema.",
  },
  {
    q: "Qual a diferença entre operador e investidor?",
    a: "Operador executa o dia-a-dia do negócio e conquista participação via vesting. Investidor entra com capital e tem retorno passivo. O modelo 'ambos' combina os dois — você opera e investe. Cada perfil tem acesso a modelos diferentes.",
  },
  {
    q: "O Grupo +351 participa da operação diária?",
    a: "Não. A operação é do parceiro. A holding fornece marca, método, governança, conexão com o ecossistema e reunião de conselho mensal. Sem microgestão — com métricas compartilhadas e decisões baseadas em dados FIGITAIS.",
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
