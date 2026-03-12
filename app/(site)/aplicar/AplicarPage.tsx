"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  Briefcase,
  Wallet,
  FileText,
  Shield,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

/* ─── Types ─── */
interface AplicarForm {
  /* Step 1 — Perfil */
  nome: string;
  email: string;
  telefone: string;
  pais: string;
  cidade: string;
  perfil: "operador" | "investidor" | "ambos";
  /* Step 2 — Experiência */
  experiencia: string;
  setor: string;
  empresaAtual: string;
  linkedin: string;
  /* Step 3 — Modelo de interesse */
  modelo: string[];
  capitalDisponivel: string;
  prazo: string;
  dedicacao: string;
  /* Step 4 — Proposta */
  motivacao: string;
  diferenciais: string;
  disponibilidade: string;
  /* Step 5 — NDA */
  aceitaNDA: boolean;
}

const STEPS = [
  { id: 1, label: "Perfil", icon: User },
  { id: 2, label: "Experiência", icon: Briefcase },
  { id: 3, label: "Modelo", icon: Wallet },
  { id: 4, label: "Proposta", icon: FileText },
  { id: 5, label: "Acordo", icon: Shield },
];

interface ModeloOption {
  value: string;
  label: string;
  tag: string;
}

export function AplicarPage({ modelos: modelosProp }: { modelos?: ModeloOption[] }) {
  const MODELOS: ModeloOption[] = [
    ...(modelosProp || []),
    { value: "novo-projeto", label: "Propor novo projeto", tag: "Proposta" },
  ];
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [selectedModelos, setSelectedModelos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<AplicarForm>({ mode: "onTouched" });

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";

  /* ─── Navigation ─── */
  const fieldsPerStep: Record<number, (keyof AplicarForm)[]> = {
    1: ["nome", "email", "telefone", "pais", "cidade", "perfil"],
    2: ["experiencia", "setor"],
    3: ["capitalDisponivel", "prazo", "dedicacao"],
    4: ["motivacao", "diferenciais"],
    5: ["aceitaNDA"],
  };

  async function nextStep() {
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, 5));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function toggleModelo(value: string) {
    setSelectedModelos((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  /* ─── Submit ─── */
  const onSubmit = async (data: AplicarForm) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          modelo: selectedModelos,
          tipo: "aplicacao-jv",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  /* ─── Progress ─── */
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Aplicar a uma Joint Venture
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-primary font-display mb-4">
              Construa conosco
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">
              Preencha o formulário abaixo para se candidatar como operador,
              investidor ou parceiro estratégico de uma das nossas marcas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {status === "sent" ? (
            <AnimatedSection>
              <div className="bg-surface rounded-2xl border border-success/20 p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Candidatura enviada
                </h2>
                <p className="text-muted mb-4 leading-relaxed">
                  Recebemos sua candidatura e ela será analisada pela equipa de
                  governança do Grupo +351. Entraremos em contato em até 5 dias
                  úteis com os próximos passos.
                </p>
                <p className="text-xs text-muted/60">
                  Caso necessário, enviaremos um NDA formal antes de compartilhar
                  informações confidenciais do modelo.
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              {/* Step indicator */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  {STEPS.map((s) => {
                    const Icon = s.icon;
                    const isActive = s.id === step;
                    const isDone = s.id < step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`flex flex-col items-center gap-1.5 transition-all ${
                          isActive
                            ? "text-accent"
                            : isDone
                            ? "text-success cursor-pointer"
                            : "text-muted/30"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive
                              ? "border-accent bg-accent/5"
                              : isDone
                              ? "border-success bg-success/5"
                              : "border-border"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wider hidden md:block">
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Form steps */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-surface rounded-2xl border border-border p-8 md:p-10 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {/* ─── Step 1: Perfil ─── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Dados pessoais
                        </h2>
                        <p className="text-muted text-sm mb-8">
                          Informações básicas sobre você.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Nome completo *
                            </label>
                            <input
                              {...register("nome", { required: "Nome obrigatório" })}
                              className={inputClass}
                              placeholder="Seu nome completo"
                            />
                            {errors.nome && (
                              <p className="text-error text-xs mt-1">{errors.nome.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Email *
                            </label>
                            <input
                              {...register("email", {
                                required: "Email obrigatório",
                                pattern: {
                                  value: /^\S+@\S+\.\S+$/,
                                  message: "Email inválido",
                                },
                              })}
                              type="email"
                              className={inputClass}
                              placeholder="seu@email.com"
                            />
                            {errors.email && (
                              <p className="text-error text-xs mt-1">{errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Telefone *
                            </label>
                            <input
                              {...register("telefone", { required: "Telefone obrigatório" })}
                              className={inputClass}
                              placeholder="+351 000 000 000"
                            />
                            {errors.telefone && (
                              <p className="text-error text-xs mt-1">{errors.telefone.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              País *
                            </label>
                            <input
                              {...register("pais", { required: "País obrigatório" })}
                              className={inputClass}
                              placeholder="Portugal"
                            />
                            {errors.pais && (
                              <p className="text-error text-xs mt-1">{errors.pais.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Cidade *
                            </label>
                            <input
                              {...register("cidade", { required: "Cidade obrigatória" })}
                              className={inputClass}
                              placeholder="Cascais"
                            />
                            {errors.cidade && (
                              <p className="text-error text-xs mt-1">{errors.cidade.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Como pretende participar? *
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: "operador", label: "Operador", desc: "Vou operar o negócio" },
                              { value: "investidor", label: "Investidor", desc: "Vou investir capital" },
                              { value: "ambos", label: "Ambos", desc: "Operar e investir" },
                            ].map((opt) => (
                              <label key={opt.value} className="cursor-pointer">
                                <input
                                  type="radio"
                                  {...register("perfil", { required: "Selecione seu perfil" })}
                                  value={opt.value}
                                  className="sr-only peer"
                                />
                                <div className="p-4 rounded-xl border-2 border-border peer-checked:border-accent peer-checked:bg-accent/5 hover:border-accent/30 transition-all text-center">
                                  <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                                  <p className="text-muted text-xs mt-1">{opt.desc}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.perfil && (
                            <p className="text-error text-xs mt-2">{errors.perfil.message}</p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Step 2: Experiência ─── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Experiência profissional
                        </h2>
                        <p className="text-muted text-sm mb-8">
                          Conte-nos sobre sua trajetória.
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Resumo da experiência *
                            </label>
                            <textarea
                              {...register("experiencia", {
                                required: "Descreva sua experiência",
                                minLength: { value: 20, message: "Mínimo 20 caracteres" },
                              })}
                              rows={4}
                              className={`${inputClass} resize-none`}
                              placeholder="Descreva sua experiência profissional relevante, negócios que já operou ou investiu, e resultados alcançados..."
                            />
                            {errors.experiencia && (
                              <p className="text-error text-xs mt-1">{errors.experiencia.message}</p>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Setor principal *
                              </label>
                              <select
                                {...register("setor", { required: "Selecione um setor" })}
                                className={inputClass}
                                defaultValue=""
                              >
                                <option value="" disabled>Selecione...</option>
                                <option value="food-service">Food Service / Restauração</option>
                                <option value="varejo">Varejo / Retalho</option>
                                <option value="tecnologia">Tecnologia</option>
                                <option value="franquias">Franquias / Franchising</option>
                                <option value="importacao">Importação / Comércio Exterior</option>
                                <option value="educacao">Educação</option>
                                <option value="servicos">Serviços</option>
                                <option value="manufatura">Manufatura / Indústria</option>
                                <option value="financeiro">Financeiro / Investimentos</option>
                                <option value="outro">Outro</option>
                              </select>
                              {errors.setor && (
                                <p className="text-error text-xs mt-1">{errors.setor.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Empresa atual
                              </label>
                              <input
                                {...register("empresaAtual")}
                                className={inputClass}
                                placeholder="Nome da empresa (opcional)"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              LinkedIn
                            </label>
                            <input
                              {...register("linkedin")}
                              className={inputClass}
                              placeholder="https://linkedin.com/in/seuperfil"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Step 3: Modelo ─── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Modelo de interesse
                        </h2>
                        <p className="text-muted text-sm mb-8">
                          Selecione as marcas que mais lhe interessam e o capital disponível.
                        </p>

                        <div className="mb-8">
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Marcas de interesse (selecione uma ou mais)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {MODELOS.map((m) => (
                              <button
                                key={m.value}
                                type="button"
                                onClick={() => toggleModelo(m.value)}
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                  selectedModelos.includes(m.value)
                                    ? "border-accent bg-accent/5"
                                    : "border-border hover:border-accent/30"
                                }`}
                              >
                                <p className="font-semibold text-foreground text-sm leading-tight">
                                  {m.label}
                                </p>
                                <p className="text-muted text-[10px] mt-1">{m.tag}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Capital disponível *
                            </label>
                            <select
                              {...register("capitalDisponivel", { required: "Selecione" })}
                              className={inputClass}
                              defaultValue=""
                            >
                              <option value="" disabled>Selecione...</option>
                              <option value="ate-10k">Até 10.000 EUR</option>
                              <option value="10k-30k">10.000 - 30.000 EUR</option>
                              <option value="30k-50k">30.000 - 50.000 EUR</option>
                              <option value="50k-100k">50.000 - 100.000 EUR</option>
                              <option value="100k-250k">100.000 - 250.000 EUR</option>
                              <option value="250k+">Acima de 250.000 EUR</option>
                              <option value="a-definir">A definir</option>
                            </select>
                            {errors.capitalDisponivel && (
                              <p className="text-error text-xs mt-1">{errors.capitalDisponivel.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Prazo para iniciar *
                            </label>
                            <select
                              {...register("prazo", { required: "Selecione" })}
                              className={inputClass}
                              defaultValue=""
                            >
                              <option value="" disabled>Selecione...</option>
                              <option value="imediato">Imediato</option>
                              <option value="1-3-meses">1 a 3 meses</option>
                              <option value="3-6-meses">3 a 6 meses</option>
                              <option value="6-12-meses">6 a 12 meses</option>
                              <option value="flexivel">Flexível</option>
                            </select>
                            {errors.prazo && (
                              <p className="text-error text-xs mt-1">{errors.prazo.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Dedicação *
                            </label>
                            <select
                              {...register("dedicacao", { required: "Selecione" })}
                              className={inputClass}
                              defaultValue=""
                            >
                              <option value="" disabled>Selecione...</option>
                              <option value="integral">Tempo integral</option>
                              <option value="parcial">Tempo parcial</option>
                              <option value="passivo">Investimento passivo</option>
                            </select>
                            {errors.dedicacao && (
                              <p className="text-error text-xs mt-1">{errors.dedicacao.message}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Step 4: Proposta ─── */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Sua proposta
                        </h2>
                        <p className="text-muted text-sm mb-8">
                          Conte-nos por que quer fazer parte do ecossistema +351.
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Por que quer fazer parte? *
                            </label>
                            <textarea
                              {...register("motivacao", {
                                required: "Descreva sua motivação",
                                minLength: { value: 20, message: "Mínimo 20 caracteres" },
                              })}
                              rows={4}
                              className={`${inputClass} resize-none`}
                              placeholder="O que te atrai no modelo do Grupo +351? Que tipo de parceria imagina?"
                            />
                            {errors.motivacao && (
                              <p className="text-error text-xs mt-1">{errors.motivacao.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Seus diferenciais *
                            </label>
                            <textarea
                              {...register("diferenciais", {
                                required: "Descreva seus diferenciais",
                                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                              })}
                              rows={3}
                              className={`${inputClass} resize-none`}
                              placeholder="Que habilidades, rede de contactos ou recursos únicos você traz para a mesa?"
                            />
                            {errors.diferenciais && (
                              <p className="text-error text-xs mt-1">{errors.diferenciais.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Disponibilidade para reunião
                            </label>
                            <input
                              {...register("disponibilidade")}
                              className={inputClass}
                              placeholder="Ex: segunda a sexta, 10h-18h (horário de Lisboa)"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Step 5: NDA ─── */}
                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Acordo de Confidencialidade
                        </h2>
                        <p className="text-muted text-sm mb-8">
                          Último passo antes de enviar.
                        </p>

                        <div className="bg-white rounded-xl border border-border p-6 mb-8">
                          <h3 className="font-semibold text-foreground mb-3">
                            Termos de Confidencialidade Preliminar
                          </h3>
                          <div className="text-muted text-sm leading-relaxed space-y-3 max-h-48 overflow-y-auto pr-2">
                            <p>
                              Ao submeter esta candidatura, o candidato declara e concorda que:
                            </p>
                            <p>
                              1. Todas as informações fornecidas neste formulário são verdadeiras
                              e podem ser verificadas pelo Grupo +351.
                            </p>
                            <p>
                              2. O candidato compreende que esta candidatura não constitui, por
                              si só, uma oferta vinculativa nem garantia de parceria.
                            </p>
                            <p>
                              3. Caso a candidatura avance para a fase de análise detalhada, o
                              Grupo +351 poderá solicitar a assinatura de um Acordo de
                              Confidencialidade (NDA) formal antes de partilhar informações
                              financeiras, operacionais ou estratégicas sobre os modelos de negócio.
                            </p>
                            <p>
                              4. O candidato compromete-se a não divulgar a terceiros quaisquer
                              informações recebidas durante o processo de avaliação.
                            </p>
                            <p>
                              5. Os dados pessoais fornecidos serão tratados nos termos da Política
                              de Privacidade do Grupo +351 e do Regulamento Geral de Proteção de
                              Dados (RGPD).
                            </p>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register("aceitaNDA", {
                              required: "É necessário aceitar os termos",
                            })}
                            className="w-5 h-5 rounded border-border text-accent focus:ring-accent/30 mt-0.5"
                          />
                          <div>
                            <p className="text-foreground text-sm font-medium">
                              Li e aceito os termos de confidencialidade preliminar *
                            </p>
                            <p className="text-muted text-xs mt-1">
                              Ao marcar esta caixa, declaro que as informações são verdadeiras e
                              concordo com o tratamento dos meus dados.
                            </p>
                          </div>
                        </label>
                        {errors.aceitaNDA && (
                          <p className="text-error text-xs mt-2">{errors.aceitaNDA.message}</p>
                        )}

                        {/* Summary */}
                        <div className="mt-8 p-4 bg-accent/5 rounded-xl border border-accent/10">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Resumo da candidatura
                          </p>
                          <div className="text-xs text-muted space-y-1">
                            {selectedModelos.length > 0 && (
                              <p>
                                Marcas:{" "}
                                {selectedModelos
                                  .map((v) => MODELOS.find((m) => m.value === v)?.label)
                                  .join(", ")}
                              </p>
                            )}
                            <p>Etapas preenchidas: {step} de 5</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <div>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {status === "error" && (
                      <div className="flex items-center gap-2 text-error text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Erro ao enviar
                      </div>
                    )}

                    {step < 5 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-all hover:shadow-lg hover:shadow-primary/20"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-light transition-all hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50"
                      >
                        {status === "sending" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar candidatura
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </AnimatedSection>
          )}
        </div>
      </section>
    </main>
  );
}
