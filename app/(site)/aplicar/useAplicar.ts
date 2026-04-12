"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Briefcase, Wallet, FileText, Shield } from "lucide-react";

export interface AplicarForm {
  nome: string;
  email: string;
  telefone: string;
  pais: string;
  cidade: string;
  perfil: "operador" | "investidor" | "ambos";
  experiencia: string;
  setor: string;
  empresaAtual: string;
  linkedin: string;
  modelo: string[];
  capitalDisponivel: string;
  prazo: string;
  dedicacao: string;
  motivacao: string;
  diferenciais: string;
  disponibilidade: string;
  aceitaNDA: boolean;
}

export const STEPS = [
  { id: 1, label: "Perfil", icon: User },
  { id: 2, label: "Experiencia", icon: Briefcase },
  { id: 3, label: "Modelo", icon: Wallet },
  { id: 4, label: "Proposta", icon: FileText },
  { id: 5, label: "Acordo", icon: Shield },
];

export interface ModeloOption {
  value: string;
  label: string;
  tag: string;
}

export function useAplicar(modelosProp?: ModeloOption[]) {
  const MODELOS: ModeloOption[] = [
    ...(modelosProp || []),
    { value: "novo-projeto", label: "Propor novo projeto", tag: "Proposta" },
  ];

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [selectedModelos, setSelectedModelos] = useState<string[]>([]);

  const form = useForm<AplicarForm>({ mode: "onTouched" });

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";

  const fieldsPerStep: Record<number, (keyof AplicarForm)[]> = {
    1: ["nome", "email", "telefone", "pais", "cidade", "perfil"],
    2: ["experiencia", "setor"],
    3: ["capitalDisponivel", "prazo", "dedicacao"],
    4: ["motivacao", "diferenciais"],
    5: ["aceitaNDA"],
  };

  async function nextStep() {
    const valid = await form.trigger(fieldsPerStep[step]);
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

  const onSubmit = async (data: AplicarForm) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, modelo: selectedModelos, tipo: "aplicacao-jv" }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return {
    step,
    setStep,
    status,
    progress,
    MODELOS,
    selectedModelos,
    toggleModelo,
    form,
    inputClass,
    nextStep,
    prevStep,
    onSubmit,
  };
}
