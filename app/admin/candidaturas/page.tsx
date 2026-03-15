"use client";

import { useEffect, useState } from "react";
import { Search, ArrowRight, ArrowUpDown } from "lucide-react";
import type { Candidatura, CandidaturaStatus } from "@/lib/admin-types";

const statusColors: Record<string, string> = {
  nova: "bg-accent text-white",
  "em-analise": "bg-warning text-white",
  entrevista: "bg-primary text-white",
  aprovada: "bg-success text-white",
  recusada: "bg-error text-white",
  arquivada: "bg-muted text-white",
};

const statusLabels: Record<string, string> = {
  nova: "Nova",
  "em-analise": "Em análise",
  entrevista: "Entrevista",
  aprovada: "Aprovada",
  recusada: "Recusada",
  arquivada: "Arquivada",
};

const perfilLabels: Record<string, string> = {
  operador: "Operador",
  investidor: "Investidor",
  ambos: "Ambos",
};

const tierColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700 border-emerald-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-amber-100 text-amber-700 border-amber-200",
  D: "bg-red-100 text-red-700 border-red-200",
};

export default function CandidaturasPage() {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CandidaturaStatus | "todas">("todas");
  const [filterPerfil, setFilterPerfil] = useState<string>("todos");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    fetch("/api/admin/candidaturas")
      .then((r) => r.json())
      .then((data) => {
        setCandidaturas(data);
        setLoading(false);
      });
  }, []);

  const filtered = candidaturas.filter((c) => {
    if (filterStatus !== "todas" && c.status !== filterStatus) return false;
    if (filterPerfil !== "todos" && c.perfil !== filterPerfil) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.modelo.some((m) => m.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const sorted = sortByScore
    ? [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : filtered;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Candidaturas</h1>
        <p className="text-muted text-sm mt-1">{candidaturas.length} candidatura(s) total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as CandidaturaStatus | "todas")}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="todas">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={filterPerfil}
          onChange={(e) => setFilterPerfil(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="todos">Todos os perfis</option>
          <option value="operador">Operador</option>
          <option value="investidor">Investidor</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted">Nenhuma candidatura encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider">Nome</th>
                  <th
                    className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => setSortByScore(!sortByScore)}
                  >
                    <span className="inline-flex items-center gap-1">
                      Score
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Perfil</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Marcas</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Capital</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Data</th>
                  <th className="py-3 px-4 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{c.nome}</p>
                        <p className="text-xs text-muted">{c.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {c.score != null ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tierColors[c.scoreTier || "D"]}`}>
                            {c.scoreTier}
                          </span>
                          <span className="text-xs text-muted">{c.score}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs font-medium text-muted bg-surface px-2 py-1 rounded">
                        {perfilLabels[c.perfil]}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {c.modelo.slice(0, 2).map((m) => (
                          <span key={m} className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded">
                            {m}
                          </span>
                        ))}
                        {c.modelo.length > 2 && (
                          <span className="text-[10px] text-muted">+{c.modelo.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-xs text-muted">
                      {c.capitalDisponivel}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                        {statusLabels[c.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted hidden md:table-cell">
                      {new Date(c.criadoEm).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/admin/candidaturas/${c.id}`}
                        className="text-accent hover:text-accent-light transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
