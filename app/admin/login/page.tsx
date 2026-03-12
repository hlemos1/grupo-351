"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Mail, KeyRound, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        setError("Email ou senha inválidos");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 focus:bg-white/10 transition-all duration-300 text-[15px]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#111d2e] to-[#0d1f35] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-400/[0.04] rounded-full blur-[80px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[80px]" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative"
      >
        {/* Card */}
        <div className="rounded-3xl bg-white/[0.04] border border-white/[0.06] p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 flex items-center justify-center mx-auto mb-5"
            >
              <Lock className="w-6 h-6 text-accent-light" />
            </motion.div>
            <h1 className="text-xl font-bold text-white font-display tracking-tight">
              Grupo +351
            </h1>
            <p className="text-white/30 text-sm mt-1.5 tracking-wide">
              Painel de Governança
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/20 group-focus-within:text-accent-light transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`${inputClass} pl-11`}
                autoFocus
              />
            </div>

            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/20 group-focus-within:text-accent-light transition-colors duration-300" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className={`${inputClass} pl-11`}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/10"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !senha}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent to-accent-light text-white font-semibold text-[15px] hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/15 text-xs text-center mt-6 tracking-wide">
          Acesso restrito aos sócios do ecossistema
        </p>
      </motion.div>
    </div>
  );
}
