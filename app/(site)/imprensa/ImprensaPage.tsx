"use client";

import { motion } from "framer-motion";
import { ExternalLink, Newspaper, Podcast, Video, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const ease = [0.16, 1, 0.3, 1] as const;

interface Cobertura {
  tipo: "materia" | "podcast" | "video";
  veiculo: string;
  titulo: string;
  descricao: string;
  url: string;
  data: string;
  sobre: string;
}

const coberturas: Cobertura[] = [
  {
    tipo: "materia",
    veiculo: "InfoMoney",
    titulo: "Como o Sushi Rão se tornou referência em delivery no Brasil",
    descricao:
      "Reportagem sobre a trajetória do Grupo Rão, desde os R$40 mil emprestados até se tornar a maior rede de delivery do país com 200+ unidades.",
    url: "https://www.infomoney.com.br/negocios/delivery-sushi-rao/",
    data: "2023",
    sobre: "Henrique Lemos / Grupo Rão",
  },
  {
    tipo: "materia",
    veiculo: "Exame",
    titulo: "Grupo Rão aposta em multimarcas para dominar delivery",
    descricao:
      "Análise do modelo multimarca do Grupo Rão e como a estratégia de dark kitchens compartilhadas reduz custos e acelera expansão.",
    url: "https://exame.com/negocios/grupo-rao-franquias/",
    data: "2023",
    sobre: "Henrique Lemos / Grupo Rão",
  },
  {
    tipo: "podcast",
    veiculo: "Guelt Empreender",
    titulo: "Henrique Lemos — De R$40 mil a R$220 milhões em delivery",
    descricao:
      "Entrevista completa sobre a jornada empreendedora, o modelo de franquias, o super-app Mundo Rão e a expansão internacional para Portugal.",
    url: "https://www.youtube.com/@guaboraempreender",
    data: "2024",
    sobre: "Henrique Lemos",
  },
];

const tipoIcons = {
  materia: Newspaper,
  podcast: Podcast,
  video: Video,
};

const tipoLabels = {
  materia: "Matéria",
  podcast: "Podcast",
  video: "Vídeo",
};

export function ImprensaPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-28 bg-gradient-to-b from-[#f8f9fb] to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Imprensa
            </p>
            <h1 className="text-4xl md:text-[3.5rem] font-bold text-primary font-display tracking-[-0.03em] leading-[1.05] mb-6">
              Na mídia
            </h1>
            <p className="text-muted text-xl leading-[1.7] max-w-3xl tracking-[-0.006em]">
              Cobertura mediática verificável dos fundadores e projetos do
              ecossistema Grupo +351.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coberturas */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            {coberturas.map((item, i) => {
              const Icon = tipoIcons[item.tipo];
              return (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 hover:shadow-xl hover:shadow-black/[0.03] hover:border-black/[0.06] transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/[0.05] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] font-semibold text-accent bg-accent/[0.06] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {tipoLabels[item.tipo]}
                          </span>
                          <span className="text-[12px] text-muted">
                            {item.veiculo} &middot; {item.data}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-[-0.01em]">
                          {item.titulo}
                        </h3>
                        <p className="text-muted text-[14px] leading-[1.7] mb-3">
                          {item.descricao}
                        </p>
                        <p className="text-[12px] text-muted/60">
                          Sobre: {item.sobre}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
                    </div>
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-primary font-display mb-4">
              Assessoria de imprensa
            </h2>
            <p className="text-muted mb-8">
              Para entrevistas, matérias ou parcerias de conteúdo, entre em
              contato diretamente.
            </p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-light transition-all"
            >
              Falar com o Grupo +351
              <ArrowRight className="w-4 h-4" />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
