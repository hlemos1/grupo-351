"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Counter } from "@/components/Counter";
import {
  Building2,
  Globe,
  Rocket,
  Users,
  ArrowRight,
  Linkedin,
  ExternalLink,
  Award,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const timeline = [
  {
    year: "2013",
    title: "Inicio da trajetoria",
    description:
      "Os fundadores comecam suas jornadas empresariais no Brasil. Henrique co-funda o Grupo Rao com R$40 mil e uma cozinha em Botafogo.",
  },
  {
    year: "2018",
    title: "Escala nacional",
    description:
      "Grupo Rao atinge 200+ unidades em 10 estados. Fernando e Herson consolidam seus negocios no Rio de Janeiro.",
  },
  {
    year: "2024",
    title: "Mudanca para Portugal",
    description:
      "Identificacao de Portugal como hub estrategico. Inicio das conversas e planejamento para criacao de um venture builder luso-brasileiro.",
  },
  {
    year: "2025",
    title: "Fundacao do Grupo +351",
    description:
      "Estabelecimento em Cascais com sede na Pampilheira. Lancamento das primeiras empresas: Nexial GSO, Strike Studio, FarmLab 3D, Nexial E-Brand e Nexial Global.",
  },
];

const socios = [
  {
    name: "Henrique Lemos",
    initials: "HL",
    role: "CEO / CVO / CTO",
    bio: "Co-fundador do Grupo Rao (200+ unidades, R$220M/ano, Selo ABF 5x). Especialista em engenharia cognitiva, IA aplicada e escalabilidade de negocios. Criador do super-app Mundo Rao e da Rob Food (holding de hamburgueres). Autor do livro 'Delivery Milionario'. No +351, lidera estrategia, tecnologia e visao — da consultoria IA (Nexial GSO) ao sourcing internacional.",
    linkedin: "https://www.linkedin.com/in/henrique-lemos-39712b22b/",
    press: [
      { label: "InfoMoney", url: "https://www.infomoney.com.br/negocios/delivery-sushi-rao/" },
      { label: "Exame", url: "https://exame.com/negocios/grupo-rao-franquias/" },
      { label: "Podcast Guelt", url: "https://www.youtube.com/@guaboraempreender" },
    ],
    badges: ["Selo ABF 5x"],
    expertise: ["IA & Tecnologia", "Franchising", "Estrategia", "Internacionalizacao"],
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Fernando Vieira",
    initials: "FV",
    role: "COO / Head de Sourcing",
    bio: "Empreendedor com decadas de experiencia em operacoes, supply chain e gestao de fornecedores internacionais. Background na Casarao Lustres (iluminacao decorativa, 4+ decadas). No +351, lidera compras, sourcing na China, execucao operacional e a construcao da supply chain proprietaria do grupo.",
    press: [],
    badges: [],
    expertise: ["Sourcing Internacional", "Supply Chain", "Operacoes", "Importacao"],
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Herson Rosa",
    initials: "HR",
    role: "CCO / Head Comercial & RP",
    bio: "Empresario com mais de 16 anos de experiencia no mercado brasileiro, liderando a Imperio dos Freios no segmento de autopecas para linha pesada. Especialista em desenvolvimento comercial, networking estrategico e relacoes publicas. No +351, lidera a area comercial, captacao de parceiros e relacoes institucionais do grupo.",
    press: [],
    badges: [],
    expertise: ["Comercial", "Networking", "Relacoes Publicas", "Desenvolvimento de Negocios"],
    gradient: "from-amber-500 to-orange-600",
  },
];

const valores = [
  {
    icon: Building2,
    title: "Construção real",
    description: "Não fazemos consultoria. Construímos empresas e operamos junto com nossos parceiros.",
  },
  {
    icon: Users,
    title: "Parceria genuína",
    description: "Buscamos relações de longo prazo baseadas em confiança, transparência e resultados compartilhados.",
  },
  {
    icon: Globe,
    title: "Visão internacional",
    description: "Conectamos o melhor do empreendedorismo brasileiro com as oportunidades do mercado europeu.",
  },
  {
    icon: Rocket,
    title: "Execução focada",
    description: "Priorizamos ação sobre planeamento. Cada projeto é tratado com urgência e pragmatismo.",
  },
];

export function SobrePage() {
  const foundersRef = useRef<HTMLElement>(null);
  const foundersInView = useInView(foundersRef, { once: true, margin: "-80px" });
  const timelineRef = useRef<HTMLElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-80px" });
  const valoresRef = useRef<HTMLElement>(null);
  const valoresInView = useInView(valoresRef, { once: true, margin: "-80px" });

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
              Sobre o Grupo
            </p>
            <h1 className="text-4xl md:text-[3.5rem] font-bold text-primary font-display tracking-[-0.03em] leading-[1.05] mb-6">
              Quem está por trás <br className="hidden md:block" />
              do Grupo +351
            </h1>
            <p className="text-muted text-xl leading-[1.7] max-w-3xl tracking-[-0.006em]">
              Tres empreendedores brasileiros que decidiram unir experiencias
              complementares para construir empresas reais em Portugal — combinando
              operacao fisica, tecnologia digital e supply chain global.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Numeros */}
      <section className="py-20 bg-white border-y border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter value={5} label="Empresas ativas" className="text-center text-4xl md:text-5xl font-bold text-primary font-display tracking-[-0.03em]" />
            <Counter value={3} label="Fundadores operacionais" className="text-center text-4xl md:text-5xl font-bold text-primary font-display tracking-[-0.03em]" />
            <Counter value={3} label="Continentes de atuacao" className="text-center text-4xl md:text-5xl font-bold text-primary font-display tracking-[-0.03em]" />
            <Counter value={130} suffix="+" label="Alunos Strike Studio" className="text-center text-4xl md:text-5xl font-bold text-primary font-display tracking-[-0.03em]" />
          </div>
        </div>
      </section>

      {/* Fundadores */}
      <section ref={foundersRef} className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={foundersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Fundadores
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-16">
              O time
            </h2>
          </motion.div>

          <div className="space-y-6">
            {socios.map((socio, i) => (
              <motion.div
                key={socio.initials}
                initial={{ opacity: 0, y: 40 }}
                animate={foundersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease }}
              >
                <div className="group bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 md:p-10 hover:shadow-xl hover:shadow-black/[0.03] hover:border-black/[0.06] transition-all duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="shrink-0">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${socio.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-black/[0.08] group-hover:scale-[1.03] transition-transform duration-500`}>
                        {socio.initials}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground tracking-[-0.02em]">
                            {socio.name}
                          </h3>
                          <p className="text-accent text-[12px] font-semibold tracking-wide uppercase">{socio.role}</p>
                        </div>
                        {socio.linkedin && (
                          <a
                            href={socio.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black/[0.12] hover:text-accent transition-colors duration-300 p-1.5 rounded-lg hover:bg-accent/[0.05]"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-muted text-[14px] leading-[1.75] mb-4">{socio.bio}</p>

                      {/* Badges */}
                      {socio.badges && socio.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {socio.badges.map((badge) => (
                            <span
                              key={badge}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full"
                            >
                              <Award className="w-3 h-3" />
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Press links */}
                      {socio.press && socio.press.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4">
                          {socio.press.map((p) => (
                            <a
                              key={p.label}
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-accent transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {p.label}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {socio.expertise.map((e) => (
                          <span
                            key={e}
                            className="text-[12px] font-medium text-primary bg-primary/[0.05] px-3.5 py-1.5 rounded-full"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-28 bg-[#f8f9fb]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Trajetória
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-16">
              Nossa história
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[1.5px] bg-black/[0.06]" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease }}
              >
                <div
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 mb-14 last:mb-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-accent border-[3px] border-white shadow-sm z-10" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-3rem)] ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <span className="text-accent font-bold text-lg tracking-[-0.01em]">{item.year}</span>
                    <h3 className="text-xl font-semibold text-foreground mt-1 mb-2 tracking-[-0.015em]">
                      {item.title}
                    </h3>
                    <p className="text-muted text-[14px] leading-[1.7]">{item.description}</p>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section ref={valoresRef} className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valoresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="max-w-3xl mb-16"
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Princípios
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-primary font-display tracking-[-0.025em] leading-[1.1] mb-6">
              Nossos valores
            </h2>
            <p className="text-muted text-lg leading-[1.7] tracking-[-0.006em]">
              O que guia cada decisão e cada parceria do Grupo +351.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {valores.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                animate={valoresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease }}
              >
                <div className="flex items-start gap-5 p-7 rounded-2xl border border-black/[0.04] hover:shadow-xl hover:shadow-black/[0.03] hover:border-black/[0.06] transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.05] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-2 tracking-[-0.015em]">{title}</h3>
                    <p className="text-muted text-[14px] leading-[1.7]">{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-[#0f2d4a] to-primary-dark relative overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.04] blur-[140px] rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-white font-display tracking-[-0.025em] leading-[1.1] mb-5">
              Quer fazer parte desta história?
            </h2>
            <p className="text-white/50 text-lg mb-10 tracking-[-0.006em]">
              Conheça nosso modelo e descubra como podemos construir juntos.
            </p>
            <a
              href="/contato"
              className="group inline-flex items-center gap-2.5 bg-white text-primary px-8 py-4 rounded-2xl text-[15px] font-semibold hover:bg-white/95 transition-all duration-500 shadow-lg shadow-black/[0.08] hover:shadow-2xl active:scale-[0.97]"
            >
              Entrar em contato
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
