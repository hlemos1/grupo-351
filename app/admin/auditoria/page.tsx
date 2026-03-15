"use client";

import { useEffect, useState } from "react";
import { Search, Shield, Clock } from "lucide-react";

interface AuditEntry {
  id: string;
  acao: string;
  recurso: string;
  resourceId: string | null;
  adminId: string;
  adminNome: string;
  detalhes: Record<string, unknown> | null;
  ip: string | null;
  criadoEm: string;
}

const acaoColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-purple-100 text-purple-700",
  export: "bg-amber-100 text-amber-700",
};

const recursoLabels: Record<string, string> = {
  user: "Utilizador",
  company: "Empresa",
  opportunity: "Oportunidade",
  match: "Deal",
  subscription: "Assinatura",
  admin: "Admin",
};

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRecurso, setFilterRecurso] = useState("todos");
  const [filterAcao, setFilterAcao] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/auditoria?limit=200")
      .then((r) => r.json())
      .then((data) => { setLogs(data); setLoading(false); });
  }, []);

  const filtered = logs.filter((l) => {
    if (filterRecurso !== "todos" && l.recurso !== filterRecurso) return false;
    if (filterAcao !== "todos" && l.acao !== filterAcao) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.adminNome.toLowerCase().includes(q) || l.recurso.toLowerCase().includes(q) || (l.resourceId?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

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
        <h1 className="text-2xl font-bold text-foreground font-display">Auditoria</h1>
        <p className="text-muted text-sm mt-1">Histórico de ações administrativas — {logs.length} registros</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por admin ou recurso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select value={filterRecurso} onChange={(e) => setFilterRecurso(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground">
          <option value="todos">Todos os recursos</option>
          {Object.entries(recursoLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterAcao} onChange={(e) => setFilterAcao(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground">
          <option value="todos">Todas as ações</option>
          <option value="create">Criar</option>
          <option value="update">Atualizar</option>
          <option value="delete">Deletar</option>
          <option value="login">Login</option>
        </select>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Shield className="w-8 h-8 text-muted/30 mx-auto mb-2" />
          <p className="text-muted">Nenhum registro de auditoria</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div key={log.id} className="bg-white rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#111d2e] to-[#152d4a] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">{log.adminNome.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{log.adminNome}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${acaoColors[log.acao] || "bg-gray-100 text-gray-600"}`}>
                      {log.acao}
                    </span>
                    <span className="text-xs text-muted">
                      {recursoLabels[log.recurso] || log.recurso}
                    </span>
                    {log.resourceId && (
                      <span className="text-[10px] text-muted/60 font-mono">{log.resourceId.substring(0, 12)}...</span>
                    )}
                  </div>
                  {log.detalhes && (
                    <pre className="text-[10px] text-muted bg-surface rounded px-2 py-1 mt-2 overflow-x-auto">
                      {JSON.stringify(log.detalhes, null, 2)}
                    </pre>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-muted">
                      <Clock className="w-3 h-3" />
                      {new Date(log.criadoEm).toLocaleString("pt-PT")}
                    </span>
                    {log.ip && (
                      <span className="text-[10px] text-muted/60">{log.ip}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
