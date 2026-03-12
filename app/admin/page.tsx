"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Briefcase,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Sparkles,
} from "lucide-react";
import type { DashboardStats, Candidatura, Contato } from "@/lib/admin-types";

const statusColors: Record<string, string> = {
  nova: "bg-accent text-white",
  "em-analise": "bg-warning text-white",
  entrevista: "bg-primary text-white",
  aprovada: "bg-success text-white",
  recusada: "bg-error text-white",
  arquivada: "bg-muted text-white",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/candidaturas").then((r) => r.json()),
      fetch("/api/admin/contatos").then((r) => r.json()),
    ]).then(([s, c, ct]) => {
      setStats(s);
      setCandidaturas(c.slice(0, 5));
      setContatos(ct.filter((x: Contato) => !x.lido).slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  const totalProjetos = (stats?.projetos.emOperacao || 0) + (stats?.projetos.emDesenvolvimento || 0) + (stats?.projetos.emEstruturacao || 0);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">
          Bom dia, Henrique
        </h1>
        <p className="text-muted text-sm mt-0.5">
          Visão geral do ecossistema Grupo +351
        </p>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {
            icon: Users,
            label: "Candidaturas",
            value: stats?.candidaturas.total || 0,
            sub: `${stats?.candidaturas.novas || 0} novas`,
            color: "from-blue-500/10 to-blue-600/5",
            iconColor: "text-blue-500",
          },
          {
            icon: Clock,
            label: "Em análise",
            value: (stats?.candidaturas.emAnalise || 0) + (stats?.candidaturas.entrevista || 0),
            sub: "pipeline ativo",
            color: "from-amber-500/10 to-amber-600/5",
            iconColor: "text-amber-500",
          },
          {
            icon: Mail,
            label: "Contatos",
            value: stats?.contatos.naoLidos || 0,
            sub: "não lidos",
            color: "from-rose-500/10 to-rose-600/5",
            iconColor: "text-rose-500",
          },
          {
            icon: Briefcase,
            label: "Projetos",
            value: totalProjetos,
            sub: `${stats?.projetos.emOperacao || 0} em operação`,
            color: "from-emerald-500/10 to-emerald-600/5",
            iconColor: "text-emerald-500",
          },
          {
            icon: BookOpen,
            label: "Conhecimento",
            value: stats?.conhecimento?.termos || 0,
            sub: `${stats?.conhecimento?.artigos || 0} artigos`,
            color: "from-violet-500/10 to-violet-600/5",
            iconColor: "text-violet-500",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-2xl border border-black/[0.04] p-5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${kpi.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-muted mt-0.5 uppercase tracking-wider font-medium">
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { href: "/admin/candidaturas", label: "Candidaturas", icon: Users, accent: "group-hover:text-blue-500" },
          { href: "/admin/contatos", label: "Contatos", icon: Mail, accent: "group-hover:text-rose-500" },
          { href: "/admin/portfolio", label: "Marcas", icon: Briefcase, accent: "group-hover:text-emerald-500" },
          { href: "/admin/inteligencia", label: "Inteligência IA", icon: Brain, accent: "group-hover:text-violet-500" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 bg-white rounded-2xl border border-black/[0.04] px-4 py-3.5 hover:shadow-md hover:border-black/[0.06] transition-all duration-300"
            >
              <Icon className={`w-[18px] h-[18px] text-muted transition-colors ${action.accent}`} />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted/40 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          );
        })}
      </motion.div>

      {/* Pipeline */}
      {stats && stats.candidaturas.total > 0 && (
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-black/[0.04] p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="font-semibold text-foreground text-[15px]">Pipeline</h2>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Novas", count: stats.candidaturas.novas, color: "bg-accent", track: "bg-accent/10" },
              { label: "Análise", count: stats.candidaturas.emAnalise, color: "bg-amber-500", track: "bg-amber-500/10" },
              { label: "Entrevista", count: stats.candidaturas.entrevista, color: "bg-primary", track: "bg-primary/10" },
              { label: "Aprovadas", count: stats.candidaturas.aprovadas, color: "bg-emerald-500", track: "bg-emerald-500/10" },
              { label: "Recusadas", count: stats.candidaturas.recusadas, color: "bg-rose-500", track: "bg-rose-500/10" },
            ].map((stage) => (
              <div key={stage.label} className="flex-1 text-center">
                <div className={`h-1.5 rounded-full ${stage.track} overflow-hidden mb-3`}>
                  <motion.div
                    className={`h-full rounded-full ${stage.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: stage.count > 0 ? "100%" : "0%" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-lg font-bold text-foreground">{stage.count}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest font-medium">{stage.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Candidaturas */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-black/[0.04] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground text-[15px]">Últimas candidaturas</h2>
            <a href="/admin/candidaturas" className="text-accent text-xs font-medium hover:underline flex items-center gap-1 group">
              Ver todas <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          {candidaturas.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-8 h-8 text-muted/30 mx-auto mb-2" />
              <p className="text-muted text-sm">Nenhuma candidatura</p>
            </div>
          ) : (
            <div className="space-y-1">
              {candidaturas.map((c) => (
                <a
                  key={c.id}
                  href={`/admin/candidaturas/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f5f5f7] transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary text-[11px] font-bold shrink-0">
                    {c.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.nome}</p>
                    <p className="text-[11px] text-muted">{c.perfil} · {c.modelo.length} marca(s)</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contatos */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-black/[0.04] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground text-[15px]">Contatos não lidos</h2>
            <a href="/admin/contatos" className="text-accent text-xs font-medium hover:underline flex items-center gap-1 group">
              Ver todos <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          {contatos.length === 0 ? (
            <div className="text-center py-10">
              <Mail className="w-8 h-8 text-muted/30 mx-auto mb-2" />
              <p className="text-muted text-sm">Nenhum contato não lido</p>
            </div>
          ) : (
            <div className="space-y-1">
              {contatos.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f5f5f7] transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/10 to-rose-600/5 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.nome}</p>
                    <p className="text-[11px] text-muted truncate">{c.mensagem}</p>
                  </div>
                  <span className="text-[10px] text-muted/60 shrink-0 mt-1">
                    {new Date(c.criadoEm).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.a
        variants={fadeUp}
        href="/admin/inteligencia"
        className="group flex items-center gap-4 bg-gradient-to-r from-[#111d2e] to-[#1a2f4a] rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
      >
        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent-light" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-[15px]">Assistente de Inteligência</p>
          <p className="text-white/50 text-xs mt-0.5">
            Peça análises do pipeline, gere artigos ou identifique sinergias do ecossistema
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
      </motion.a>
    </motion.div>
  );
}
