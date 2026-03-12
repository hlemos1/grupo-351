"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { TextReveal } from "./TextReveal";
import { MagneticButton } from "./MagneticButton";

interface FormData {
  nome: string;
  email: string;
  empresa: string;
  tipo: string;
  mensagem: string;
}

export function Contato() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200";

  return (
    <section id="contato" className="py-24 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-8">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <TextReveal
              text="Vamos construir algo juntos"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-primary font-display mb-6"
            />
            <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
              Se você tem uma oportunidade de negócio, tecnologia ou operação que possa se
              transformar em empresa, o Grupo +351 está aberto a conversar.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-success/20 p-12 text-center shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-success" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Mensagem enviada!
                </h3>
                <p className="text-muted">
                  Entraremos em contato em até 48 horas úteis.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="relative bg-white rounded-2xl border border-border p-8 md:p-10 shadow-sm overflow-hidden"
              >
                {/* Active field glow */}
                {focusedField && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "radial-gradient(600px circle at 50% 50%, rgba(59,130,246,0.03), transparent 60%)",
                    }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <p className="text-sm font-medium text-muted">Preencha o formulário</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome *
                      </label>
                      <input
                        {...register("nome", { required: "Nome obrigatório", minLength: 2 })}
                        className={inputClass}
                        placeholder="Seu nome"
                        onFocus={() => setFocusedField("nome")}
                        onBlur={() => setFocusedField(null)}
                      />
                      {errors.nome && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-xs mt-1"
                        >
                          {errors.nome.message}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        {...register("email", {
                          required: "Email obrigatório",
                          pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" },
                        })}
                        type="email"
                        className={inputClass}
                        placeholder="seu@email.com"
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-xs mt-1"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Empresa
                      </label>
                      <input
                        {...register("empresa")}
                        className={inputClass}
                        placeholder="Nome da empresa (opcional)"
                        onFocus={() => setFocusedField("empresa")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de proposta *
                      </label>
                      <select
                        {...register("tipo", { required: "Selecione um tipo" })}
                        className={inputClass}
                        defaultValue=""
                        onFocus={() => setFocusedField("tipo")}
                        onBlur={() => setFocusedField(null)}
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>
                        <option value="joint-venture">Joint Venture</option>
                        <option value="parceria">Parceria Estratégica</option>
                        <option value="investimento">Investimento</option>
                        <option value="fornecedor">Fornecedor / Serviço</option>
                        <option value="outro">Outro</option>
                      </select>
                      {errors.tipo && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-error text-xs mt-1"
                        >
                          {errors.tipo.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      {...register("mensagem", {
                        required: "Mensagem obrigatória",
                        minLength: { value: 10, message: "Mensagem muito curta" },
                      })}
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Descreva brevemente a oportunidade ou proposta..."
                      onFocus={() => setFocusedField("mensagem")}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.mensagem && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-error text-xs mt-1"
                      >
                        {errors.mensagem.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-error text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Erro ao enviar. Tente novamente.
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="ml-auto">
                      <MagneticButton strength={0.15}>
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-light transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {status === "sending" ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Enviar mensagem
                            </>
                          )}
                        </button>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </AnimatedSection>
      </div>
    </section>
  );
}
