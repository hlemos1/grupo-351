"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const googleError = searchParams.get("error");
    if (googleError?.startsWith("google_")) {
      const messages: Record<string, string> = {
        google_denied: "Login com Google cancelado",
        google_email: "Email do Google não verificado",
        google_config: "Google OAuth não configurado",
      };
      setError(messages[googleError] || "Erro ao entrar com Google");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/platform/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao entrar");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all";

  return (
    <>
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
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
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

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-amber-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-white/30 text-sm mt-8">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-amber-500 hover:text-amber-400 transition-colors">
          Criar conta
        </Link>
      </p>

      <div className="text-center mt-4">
        <Link href="/" className="text-white/20 text-xs hover:text-white/40 transition-colors">
          Voltar ao site
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#111d2e] to-[#0d1f35] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Logo className="text-white mx-auto mb-4" size={32} />
          <h1 className="text-xl font-bold text-white">Entrar na plataforma</h1>
          <p className="text-white/40 text-sm mt-2">
            Acesse seu dashboard e oportunidades
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
