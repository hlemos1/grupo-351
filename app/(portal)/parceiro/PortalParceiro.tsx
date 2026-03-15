"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  Target,
  Calendar,
  Building2,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const ease = [0.16, 1, 0.3, 1] as const;

interface PortalData {
  parceiro: {
    nome: string;
    papel: string;
    criadoEm: string;
  };
  projeto: {
    name: string;
    tagline: string;
    status: string;
    mercado: string;
    controle: string;
  } | null;
  metricas: {
    faturamentoMensal?: number;
    ticketMedio?: number;
    pedidosMes?: number;
    satisfacao?: number;
    metaMensal?: number;
    historico?: { mes: string; valor: number }[];
    observacoes?: string;
  } | null;
}

const statusColors: Record<string, string> = {
  "Ideação": "bg-purple-100 text-purple-700",
  "Em estruturação": "bg-gray-100 text-gray-700",
  "Em desenvolvimento": "bg-amber-100 text-amber-700",
  "Em operação": "bg-emerald-100 text-emerald-700",
  "Consolidado": "bg-blue-100 text-blue-700",
};

export function PortalParceiro() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monta URL: usa token da query string (primeiro acesso) ou cookie (sessão)
    const url = token
      ? `/api/parceiro?token=${encodeURIComponent(token)}`
      : "/api/parceiro";

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Token inválido");
        return r.json();
      })
      .then((result) => {
        setData(result);
        // Limpar token da URL (agora está no cookie httpOnly)
        if (token) {
          window.history.replaceState({}, "", "/parceiro");
        }
      })
      .catch(() => setError("Token inválido ou expirado. Contacte o Grupo +351."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#111d2e] to-[#0d1f35] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Acesso restrito</h1>
          <p className="text-white/40 mb-8">{error}</p>
          <a
            href="/contato"
            className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/15 transition-all"
          >
            Contactar o Grupo +351
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  const { parceiro, projeto, metricas } = data;
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-black/[0.04] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="text-primary" size={24} />
            <div className="h-6 w-px bg-black/[0.06]" />
            <span className="text-sm text-muted">Portal do Parceiro</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{parceiro.nome}</p>
              <p className="text-[11px] text-muted capitalize">{parceiro.papel}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Boas-vindas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-display tracking-tight mb-2">
            Olá, {parceiro.nome.split(" ")[0]}
          </h1>
          <p className="text-muted">
            Acompanhe as métricas e o progresso da sua Joint Venture.
          </p>
        </motion.div>

        {/* Projeto info */}
        {projeto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="bg-white rounded-2xl border border-black/[0.04] p-6 md:p-8 mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/[0.05] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{projeto.name}</h2>
                  <p className="text-muted text-sm">{projeto.tagline}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[projeto.status] || "bg-gray-100 text-gray-700"}`}>
                {projeto.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">Mercado</p>
                <p className="text-sm font-medium text-foreground">{projeto.mercado}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">Estrutura</p>
                <p className="text-sm font-medium text-foreground">{projeto.controle}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider">Parceiro desde</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(parceiro.criadoEm).toLocaleDateString("pt-PT", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Métricas */}
        {metricas ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                {
                  icon: DollarSign,
                  label: "Faturamento mensal",
                  value: metricas.faturamentoMensal ? fmt(metricas.faturamentoMensal) : "—",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  icon: ShoppingCart,
                  label: "Pedidos/mês",
                  value: metricas.pedidosMes?.toLocaleString("pt-PT") || "—",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: TrendingUp,
                  label: "Ticket médio",
                  value: metricas.ticketMedio ? fmt(metricas.ticketMedio) : "—",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  icon: Star,
                  label: "Satisfação",
                  value: metricas.satisfacao ? `${metricas.satisfacao}/5` : "—",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
              ].map(({ icon: Icon, label, value, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease }}
                  className="bg-white rounded-2xl border border-black/[0.04] p-5 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-500"
                >
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className={`text-xl font-bold ${color} tracking-tight`}>{value}</p>
                  <p className="text-[12px] text-muted mt-1">{label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Meta */}
            {metricas.metaMensal && metricas.faturamentoMensal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease }}
                className="bg-white rounded-2xl border border-black/[0.04] p-6 mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Meta mensal</h3>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-3 bg-[#f0f1f3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((metricas.faturamentoMensal / metricas.metaMensal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {Math.round((metricas.faturamentoMensal / metricas.metaMensal) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {fmt(metricas.faturamentoMensal)} de {fmt(metricas.metaMensal)}
                </p>
              </motion.div>
            )}

            {/* Histórico */}
            {metricas.historico && metricas.historico.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease }}
                className="bg-white rounded-2xl border border-black/[0.04] p-6 mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Histórico de faturamento</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/[0.04]">
                        <th className="text-left py-2 text-xs text-muted uppercase tracking-wider">Mês</th>
                        <th className="text-right py-2 text-xs text-muted uppercase tracking-wider">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricas.historico.map((h) => (
                        <tr key={h.mes} className="border-b border-black/[0.02]">
                          <td className="py-2.5 text-foreground">{h.mes}</td>
                          <td className="py-2.5 text-right font-medium text-foreground">
                            {fmt(h.valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Observações */}
            {metricas.observacoes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease }}
                className="bg-accent/[0.04] border border-accent/10 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-2">Notas da governança</h3>
                <p className="text-muted text-sm leading-relaxed">{metricas.observacoes}</p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="bg-white rounded-2xl border border-black/[0.04] p-12 text-center"
          >
            <AlertCircle className="w-10 h-10 text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Métricas ainda não disponíveis
            </h3>
            <p className="text-muted text-sm max-w-md mx-auto">
              A equipa de governança irá carregar as métricas da sua JV em breve.
              Quando disponíveis, aparecerão automaticamente aqui.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[11px] text-muted">
            Portal do Parceiro — Grupo +351
          </p>
          <a
            href="mailto:contato@grupo351.com"
            className="text-[11px] text-accent hover:underline"
          >
            Suporte
          </a>
        </div>
      </footer>
    </div>
  );
}
