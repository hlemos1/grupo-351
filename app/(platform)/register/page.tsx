"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", role: "empresa" as const });
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.senha.length < 8) {
      setError("Senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/platform/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar conta");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#111d2e] to-[#0d1f35] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Logo className="text-white mx-auto mb-4" size={32} />
          <h1 className="text-xl font-bold text-white">Criar conta</h1>
          <p className="text-white/40 text-sm mt-2">
            Entre no ecossistema +351
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Nome completo</label>
            <input
              type="text"
              className={inputClass}
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showSenha ? "text" : "password"}
                className={inputClass}
                value={form.senha}
                onChange={(e) => set("senha", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Eu sou</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "empresa", label: "Empresa", desc: "Quero crescer" },
                { value: "parceiro", label: "Parceiro", desc: "Quero contribuir" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("role", opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.role === opt.value
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <p className={`text-sm font-medium ${form.role === opt.value ? "text-amber-400" : "text-white/70"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-white/30 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-amber-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Criando..." : "Criar conta"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-8">
          Já tem conta?{" "}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
