"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Users, ListTodo, Building2 } from "lucide-react";

interface PlatformProjectAdmin {
  id: string;
  nome: string;
  descricao: string | null;
  status: string;
  criadoEm: string;
  updatedAt: string;
  match: {
    id: string;
    status: string;
    opportunity: { titulo: string; tipo: string };
    fromUser: { id: string; nome: string };
    toUser: { id: string; nome: string };
  };
  members: { role: string; company: { id: string; nome: string; slug: string } }[];
  _count: { tasks: number };
}

const statusColors: Record<string, string> = {
  ativo: "bg-emerald-100 text-emerald-700",
  pausado: "bg-amber-100 text-amber-700",
  concluido: "bg-blue-100 text-blue-700",
  cancelado: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default function ProjetosPlataformaPage() {
  const [projects, setProjects] = useState<PlatformProjectAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    fetch("/api/admin/platform-projects")
      .then((r) => r.json())
      .then((data) => { setProjects(data); setLoading(false); });
  }, []);

  const filtered = filterStatus === "todos" ? projects : projects.filter((p) => p.status === filterStatus);

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
        <h1 className="text-2xl font-bold text-foreground font-display">Projetos da Plataforma</h1>
        <p className="text-muted text-sm mt-1">
          {projects.length} projeto(s) — {projects.filter((p) => p.status === "ativo").length} ativos
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{projects.filter((p) => p.status === key).length}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="todos">Todos os status</option>
          {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted">Nenhum projeto encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">{p.nome}</h3>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabels[p.status] || p.status}
                </span>
              </div>

              {p.descricao && (
                <p className="text-xs text-muted mb-3 line-clamp-2">{p.descricao}</p>
              )}

              <div className="bg-surface rounded-lg p-3 mb-3">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Oportunidade</p>
                <p className="text-xs font-medium text-foreground">{p.match.opportunity.titulo}</p>
                <p className="text-[10px] text-muted mt-0.5">{p.match.opportunity.tipo} · {p.match.fromUser.nome} ↔ {p.match.toUser.nome}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Building2 className="w-3 h-3" />
                    <span>{p.members.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <ListTodo className="w-3 h-3" />
                    <span>{p._count.tasks} tasks</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted">{new Date(p.updatedAt).toLocaleDateString("pt-PT")}</p>
              </div>

              {p.members.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {p.members.map((m) => (
                      <span key={m.company.id} className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded">
                        {m.company.nome} ({m.role})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
