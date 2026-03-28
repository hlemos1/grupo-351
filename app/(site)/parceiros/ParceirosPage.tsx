"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Printer,
  ShoppingBag,
  Globe,
  Dumbbell,
  Brain,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Zap,
  ChevronDown,
  Calculator,
  CheckCircle,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

/* --- Data --- */
const iconMap: Record<string, typeof Printer> = {
  printer: Printer,
  "shopping-bag": ShoppingBag,
  globe: Globe,
  dumbbell: Dumbbell,
  brain: Brain,
};

interface ModeloJV {
  slug: string;
  name: string;
  icon: string;
  tag: string;
  status: string;
  perfilIdeal: string;
  estrutura: { holding: string; operador: string; nota?: string };
  investimento: { min: number; max: number };
  retornoEstimado: string;
  prazoRetorno: string;
  destaques: string[];
  oQueHoldingFornece: string[];
  oQueOperadorFaz: string[];
}

const modelos: ModeloJV[] = [
  {
    slug: "strike-studio",
    name: "Strike Studio",
    icon: "dumbbell",
    tag: "MMA / Fitness",
    status: "Em operacao",
    perfilIdeal: "Instrutor de artes marciais, gestor de academia ou empreendedor do setor fitness",
    estrutura: { holding: "50%", operador: "50%" },
    investimento: { min: 15000, max: 50000 },
    retornoEstimado: "Ticket medio x recorrencia mensal",
    prazoRetorno: "8-14 meses",
    destaques: [
      "Unidade piloto com 130+ alunos validados",
      "Strike House (MMA) + Strike Lab (boxe gamificado com IA)",
      "Tese de franqueadora em validacao",
    ],
    oQueHoldingFornece: [
      "Marca, metodo e identidade visual",
      "Modelo operacional validado",
      "Tecnologia de gamificacao (IA)",
      "Expansao e marketing institucional",
    ],
    oQueOperadorFaz: [
      "Opera o dia-a-dia do studio",
      "Gestao de alunos e instrutores",
      "Mantem padrao operacional e qualidade",
    ],
  },
  {
    slug: "nexial-e-brand",
    name: "Nexial E-Brand",
    icon: "shopping-bag",
    tag: "E-commerce",
    status: "Em desenvolvimento",
    perfilIdeal: "Empreendedor com experiencia em e-commerce, marketplace ou importacao",
    estrutura: { holding: "75%", operador: "25%", nota: "Investidor-operador" },
    investimento: { min: 10000, max: 30000 },
    retornoEstimado: "Variavel por margem de produto",
    prazoRetorno: "6-12 meses",
    destaques: [
      "Marca Axis (mochilas LED) em lancamento",
      "Sourcing direto via Nexial Global",
      "Cada marca validada vira empresa propria",
    ],
    oQueHoldingFornece: [
      "Supply chain China-Europa",
      "Plataforma e-commerce e Amazon",
      "Validacao de produto e marca",
      "Estrutura de importacao",
    ],
    oQueOperadorFaz: [
      "Gestao de marketplace e vendas",
      "Marketing digital e growth",
      "Atendimento ao cliente",
    ],
  },
  {
    slug: "farmlab-3d",
    name: "FarmLab 3D",
    icon: "printer",
    tag: "Impressao 3D",
    status: "Em operacao",
    perfilIdeal: "Maker, designer 3D ou empreendedor com interesse em manufatura aditiva",
    estrutura: { holding: "75%", operador: "25%" },
    investimento: { min: 5000, max: 15000 },
    retornoEstimado: "25-40% margem bruta",
    prazoRetorno: "6-12 meses",
    destaques: [
      "CAPEX mais baixo do portfolio",
      "5 impressoras operacionais",
      "Produtos validados viram marcas proprias",
    ],
    oQueHoldingFornece: [
      "Farm de impressoras e infraestrutura",
      "Canal de vendas via E-Brand",
      "Marca e identidade visual",
      "Estrategia de produto",
    ],
    oQueOperadorFaz: [
      "Opera a producao e controle de qualidade",
      "Desenvolve novos produtos e prototipos",
      "Atende demanda customizada",
    ],
  },
  {
    slug: "nexial-global",
    name: "Nexial Global",
    icon: "globe",
    tag: "Sourcing / Supply Chain",
    status: "Em estruturacao",
    perfilIdeal: "Profissional com experiencia em comercio exterior, importacao ou logistica internacional",
    estrutura: { holding: "40%", operador: "40%", nota: "+ 20% Conselheiro" },
    investimento: { min: 20000, max: 60000 },
    retornoEstimado: "Comissao + margem de intermediacao",
    prazoRetorno: "12-18 meses",
    destaques: [
      "Parceiro com 20 anos de operacao na China",
      "Supply chain proprietaria Asia-Europa",
      "Potencial de maior ativo estrategico do grupo",
    ],
    oQueHoldingFornece: [
      "Rede de contatos e clientes",
      "Estrutura juridica e logistica",
      "Plataforma digital de gestao",
      "Conexao com as verticais do grupo",
    ],
    oQueOperadorFaz: [
      "Operacao na China (fabricas, negociacao)",
      "Gestao de fornecedores e qualidade",
      "Logistica de importacao e entrega",
    ],
  },
  {
    slug: "nexial-gso",
    name: "Nexial GSO",
    icon: "brain",
    tag: "Consultoria IA",
    status: "Em operacao",
    perfilIdeal: "Consultor de tecnologia, especialista em IA ou gestor de transformacao digital",
    estrutura: { holding: "100%", operador: "Stock options" },
    investimento: { min: 0, max: 0 },
    retornoEstimado: "Recorrencia mensal por cliente",
    prazoRetorno: "Imediato (ja com cliente)",
    destaques: [
      "Metodo A&E proprietario (Foundation Systems)",
      "Modelo completo: diagnostico + implementacao + operacao",
      "Ja com cliente enterprise (Grupo Pateo)",
    ],
    oQueHoldingFornece: [
      "Metodo A&E e propriedade intelectual",
      "Tecnologia e ferramentas de IA",
      "Rede de clientes e pipeline comercial",
      "Estrutura operacional",
    ],
    oQueOperadorFaz: [
      "Consultoria e diagnostico em campo",
      "Implementacao de solucoes",
      "Gestao da operacao continua com cliente",
    ],
  },
];

/* --- Simulador --- */
function Simulador({ modelo }: { modelo: ModeloJV }) {
  const [investimento, setInvestimento] = useState(modelo.investimento.min);
  const margemBaixa = investimento * 0.25;
  const margemAlta = investimento * 0.45;

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="w-4 h-4 text-accent" />
        <p className="font-semibold text-foreground text-[14px] tracking-[-0.01em]">Simulador rapido</p>
      </div>

      <div className="mb-5">
        <label className="text-[13px] text-muted mb-2.5 block">
          Investimento: <span className="font-semibold text-foreground">{investimento.toLocaleString("pt-PT")} EUR</span>
        </label>
        <input
          type="range"
          min={modelo.investimento.min}
          max={modelo.investimento.max}
          step={1000}
          value={investimento}
          onChange={(e) => setInvestimento(Number(e.target.value))}
          className="w-full accent-accent h-1.5"
        />
        <div className="flex justify-between text-[11px] text-muted/50 mt-1.5 font-medium">
          <span>{modelo.investimento.min.toLocaleString("pt-PT")} EUR</span>
          <span>{modelo.investimento.max.toLocaleString("pt-PT")} EUR</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f8f9fb] rounded-xl p-4">
          <p className="text-[10px] text-muted uppercase tracking-[0.15em] font-semibold mb-1">Retorno estimado/ano</p>
          <p className="font-bold text-foreground text-[15px] tracking-[-0.01em]">
            {margemBaixa.toLocaleString("pt-PT", { maximumFractionDigits: 0 })} -{" "}
            {margemAlta.toLocaleString("pt-PT", { maximumFractionDigits: 0 })} EUR
          </p>
        </div>
        <div className="bg-[#f8f9fb] rounded-xl p-4">
          <p className="text-[10px] text-muted uppercase tracking-[0.15em] font-semibold mb-1">Prazo retorno</p>
          <p className="font-bold text-foreground text-[15px] tracking-[-0.01em]">{modelo.prazoRetorno}</p>
        </div>
      </div>

      <p className="text-[10px] text-muted/40 mt-3 leading-relaxed">
        * Valores estimados com base em projecoes internas. Nao constituem garantia de retorno.
      </p>
    </div>
  );
}

/* --- Wallet icon --- */
function Wallet({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

/* --- ModeloCard --- */
function ModeloCard({ modelo }: { modelo: ModeloJV }) {
  const [open, setOpen] = useState(false);
  const Icon = iconMap[modelo.icon] || Printer;

  return (
    <div className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] overflow-hidden hover:border-black/[0.06] hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-500">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-6 md:p-8 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/[0.05] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h3 className="text-xl font-bold text-foreground tracking-[-0.015em]">{modelo.name}</h3>
                <span className="text-[11px] font-semibold text-accent bg-accent/[0.06] px-2.5 py-1 rounded-full tracking-wide">
                  {modelo.tag}
                </span>
              </div>
              <p className="text-muted text-[14px] leading-[1.6]">{modelo.perfilIdeal}</p>

              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-[12px] text-muted">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  {modelo.retornoEstimado}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted">
                  <Wallet className="w-3.5 h-3.5 text-accent" />
                  {modelo.investimento.min.toLocaleString("pt-PT")} - {modelo.investimento.max.toLocaleString("pt-PT")} EUR
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted">
                  <div className={`w-2 h-2 rounded-full ${modelo.status === "Em operação" ? "bg-emerald-500" : modelo.status === "Em desenvolvimento" ? "bg-amber-500" : "bg-muted"}`} />
                  {modelo.status}
                </div>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center mt-1"
          >
            <ChevronDown className="w-4 h-4 text-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 border-t border-black/[0.04] pt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Estrutura societaria */}
                  <div>
                    <h4 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Estrutura societaria
                    </h4>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-primary/[0.04] rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-primary tracking-[-0.02em]">{modelo.estrutura.holding}</p>
                        <p className="text-[11px] text-muted font-medium">Holding</p>
                      </div>
                      <div className="flex-1 bg-accent/[0.04] rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-accent tracking-[-0.02em]">{modelo.estrutura.operador}</p>
                        <p className="text-[11px] text-muted font-medium">Operador</p>
                      </div>
                    </div>
                    {modelo.estrutura.nota && (
                      <p className="text-[12px] text-muted/60 mt-2">{modelo.estrutura.nota}</p>
                    )}
                  </div>

                  {/* Destaques */}
                  <div>
                    <h4 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Destaques
                    </h4>
                    <ul className="space-y-2.5">
                      {modelo.destaques.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[13px] text-muted">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* O que cada parte faz */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[11px] font-semibold text-primary uppercase tracking-[0.15em] mb-2.5">
                        Holding fornece
                      </h4>
                      <ul className="space-y-2">
                        {modelo.oQueHoldingFornece.map((item) => (
                          <li key={item} className="text-[12px] text-muted flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em] mb-2.5">
                        Operador faz
                      </h4>
                      <ul className="space-y-2">
                        {modelo.oQueOperadorFaz.map((item) => (
                          <li key={item} className="text-[12px] text-muted flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Simulador modelo={modelo} />
                  <a
                    href="/aplicar"
                    className="group flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl text-[14px] font-semibold hover:bg-primary-light transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 active:scale-[0.97]"
                  >
                    Candidatar-se a este modelo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --- Page --- */
export function ParceirosPage() {
  const modelosRef = useRef<HTMLElement>(null);
  const modelosInView = useInView(modelosRef, { once: true, margin: "-80px" });
  const vantagensRef = useRef<HTMLElement>(null);
  const vantagensInView = useInView(vantagensRef, { once: true, margin: "-80px" });

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
              Portal do Parceiro
            </p>
            <h1 className="text-3xl md:text-[3.5rem] font-bold text-primary font-display tracking-[-0.03em] leading-[1.05] mb-5">
              Modelos de Joint Venture
            </h1>
            <p className="text-muted text-lg leading-[1.7] max-w-3xl tracking-[-0.006em]">
              Cada marca do ecossistema +351 tem uma estrutura societaria e um
              perfil de parceiro ideal. Explore os modelos, simule o investimento
              e candidate-se.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-14 bg-white border-y border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Explore", desc: "Conheca os modelos e estruturas de cada marca" },
              { num: "02", title: "Simule", desc: "Use o simulador para entender investimento e retorno" },
              { num: "03", title: "Candidate-se", desc: "Preencha o formulario estruturado de aplicacao" },
              { num: "04", title: "Negocie", desc: "Avancamos para NDA e termos detalhados" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease }}
                className="text-center md:text-left"
              >
                <span className="text-3xl font-bold text-black/[0.04] font-display tracking-[-0.03em]">{item.num}</span>
                <h3 className="font-semibold text-foreground mt-1 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-muted text-[13px] mt-1 leading-[1.6]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modelos */}
      <section ref={modelosRef} className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={modelosInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-2xl md:text-[2.25rem] font-bold text-primary font-display tracking-[-0.025em] mb-2">
              Modelos disponiveis
            </h2>
            <p className="text-muted text-[15px] mb-10 tracking-[-0.006em]">
              Clique em cada modelo para ver detalhes, estrutura e simulador.
            </p>
          </motion.div>

          <div className="space-y-4">
            {modelos.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={modelosInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease }}
              >
                <ModeloCard modelo={m} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section ref={vantagensRef} className="py-28 bg-[#f8f9fb]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={vantagensInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-2xl md:text-[2.25rem] font-bold text-primary font-display tracking-[-0.025em] mb-12 text-center">
              Por que ser parceiro do +351?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Governança real",
                desc: "Acordos de socios claros, vesting, metricas e conselho ativo. Nao e promessa — e estrutura.",
              },
              {
                icon: Users,
                title: "Ecossistema integrado",
                desc: "Suas operacoes se conectam com as outras marcas do grupo. Dados, clientes e supply chain compartilhados.",
              },
              {
                icon: TrendingUp,
                title: "Experiência comprovada",
                desc: "Fundadores com 200+ unidades criadas no Brasil. O metodo foi testado antes de chegar aqui.",
              },
            ].map(({ icon: VIcon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                animate={vantagensInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease }}
              >
                <div className="bg-white rounded-2xl border border-black/[0.04] p-8 h-full hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500">
                  <VIcon className="w-8 h-8 text-primary mb-5" />
                  <h3 className="font-bold text-foreground text-lg mb-2 tracking-[-0.015em]">{title}</h3>
                  <p className="text-muted text-[14px] leading-[1.7]">{desc}</p>
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
              Pronto para construir?
            </h2>
            <p className="text-white/50 text-lg mb-10 tracking-[-0.006em]">
              Candidate-se agora e inicie o processo de avaliacao.
            </p>
            <a
              href="/aplicar"
              className="group inline-flex items-center gap-2.5 bg-white text-primary px-8 py-4 rounded-2xl text-[15px] font-semibold hover:bg-white/95 transition-all duration-500 shadow-lg shadow-black/[0.08] hover:shadow-2xl active:scale-[0.97]"
            >
              Iniciar candidatura
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
