"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

interface FormData {
  nome: string;
  email: string;
  empresa: string;
  tipo: string;
  orcamento: string;
  mensagem: string;
}

export function ContatoPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
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
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-black/[0.06] bg-white text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-300 text-[14px]";

  const infoCards = [
    {
      icon: Mail,
      title: "Email",
      content: (
        <a href="mailto:contato@grupo351.com" className="text-accent text-[14px] hover:underline underline-offset-4">
          contato@grupo351.com
        </a>
      ),
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: (
        <a href="https://wa.me/351000000000" target="_blank" rel="noopener noreferrer" className="text-accent text-[14px] hover:underline underline-offset-4">
          +351 000 000 000
        </a>
      ),
    },
    {
      icon: MapPin,
      title: "Localizacao",
      content: <p className="text-muted text-[14px]">Estoril, Cascais<br />Portugal</p>,
    },
    {
      icon: Clock,
      title: "Tempo de resposta",
      content: <p className="text-muted text-[14px]">Respondemos em ate 48 horas uteis</p>,
    },
  ];

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
              Contato
            </p>
            <h1 className="text-4xl md:text-[3.5rem] font-bold text-primary font-display tracking-[-0.03em] leading-[1.05] mb-6">
              Vamos conversar
            </h1>
            <p className="text-muted text-xl leading-[1.7] max-w-3xl tracking-[-0.006em]">
              Tem uma oportunidade, proposta ou pergunta? Preencha o formulario
              abaixo ou utilize um dos nossos canais de contato.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-14">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {infoCards.map(({ icon: Icon, title, content }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.6, ease }}
                  >
                    <div className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-6 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-500">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/[0.05] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground mb-1 text-[14px] tracking-[-0.01em]">{title}</p>
                          {content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.7, ease }}
              >
                {status === "sent" ? (
                  <div className="bg-[#f8f9fb] rounded-2xl border border-emerald-500/[0.12] p-14 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/[0.08] flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-foreground mb-3 tracking-[-0.02em]">
                      Mensagem enviada!
                    </h2>
                    <p className="text-muted text-[15px] mb-6">
                      Recebemos sua mensagem e entraremos em contato em ate 48 horas uteis.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-accent hover:underline underline-offset-4 text-[14px] font-medium"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-[#f8f9fb] rounded-2xl border border-black/[0.04] p-8 md:p-10"
                  >
                    <h2 className="text-xl font-bold text-foreground mb-8 tracking-[-0.015em]">
                      Envie sua proposta
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[13px] font-medium text-foreground mb-2">
                          Nome *
                        </label>
                        <input
                          {...register("nome", { required: "Nome obrigatorio" })}
                          className={inputClass}
                          placeholder="Seu nome completo"
                        />
                        {errors.nome && (
                          <p className="text-rose-500 text-[12px] mt-1.5">{errors.nome.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <input
                          {...register("email", {
                            required: "Email obrigatorio",
                            pattern: {
                              value: /^\S+@\S+\.\S+$/,
                              message: "Email invalido",
                            },
                          })}
                          type="email"
                          className={inputClass}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <p className="text-rose-500 text-[12px] mt-1.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[13px] font-medium text-foreground mb-2">
                          Empresa
                        </label>
                        <input
                          {...register("empresa")}
                          className={inputClass}
                          placeholder="Nome da empresa (opcional)"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-foreground mb-2">
                          Tipo de proposta *
                        </label>
                        <select
                          {...register("tipo", { required: "Selecione um tipo" })}
                          className={inputClass}
                          defaultValue=""
                        >
                          <option value="" disabled>Selecione...</option>
                          <option value="joint-venture">Joint Venture</option>
                          <option value="parceria">Parceria Estrategica</option>
                          <option value="investimento">Investimento</option>
                          <option value="fornecedor">Fornecedor / Servico</option>
                          <option value="outro">Outro</option>
                        </select>
                        {errors.tipo && (
                          <p className="text-rose-500 text-[12px] mt-1.5">{errors.tipo.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        Orcamento estimado
                      </label>
                      <select
                        {...register("orcamento")}
                        className={inputClass}
                        defaultValue=""
                      >
                        <option value="" disabled>Selecione (opcional)</option>
                        <option value="ate-10k">Ate 10.000 EUR</option>
                        <option value="10k-50k">10.000 - 50.000 EUR</option>
                        <option value="50k-200k">50.000 - 200.000 EUR</option>
                        <option value="200k+">Acima de 200.000 EUR</option>
                        <option value="a-definir">A definir</option>
                      </select>
                    </div>

                    <div className="mb-8">
                      <label className="block text-[13px] font-medium text-foreground mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        {...register("mensagem", {
                          required: "Mensagem obrigatoria",
                          minLength: {
                            value: 10,
                            message: "Mensagem muito curta",
                          },
                        })}
                        rows={6}
                        className={`${inputClass} resize-none`}
                        placeholder="Descreva a oportunidade, seu background e o que espera do Grupo +351..."
                      />
                      {errors.mensagem && (
                        <p className="text-rose-500 text-[12px] mt-1.5">{errors.mensagem.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {status === "error" && (
                          <div className="flex items-center gap-2 text-rose-500 text-[13px]">
                            <AlertCircle className="w-4 h-4" />
                            Erro ao enviar. Tente novamente.
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-3.5 rounded-xl text-[14px] font-semibold hover:bg-primary-light transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                      >
                        {status === "sending" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar proposta
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
