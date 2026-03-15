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

        <a
          href="/api/platform/auth/google"
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-100 transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar com Google
        </a>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-white/20 text-xs">ou</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
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
