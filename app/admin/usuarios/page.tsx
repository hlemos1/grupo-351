"use client";

import { useEffect, useState } from "react";
import { Search, ArrowRight, ArrowUpDown, UserCheck, UserX, Globe } from "lucide-react";

interface PlatformUser {
  id: string;
  email: string;
  nome: string;
  role: string;
  avatar: string | null;
  ativo: boolean;
  googleId: boolean;
  criadoEm: string;
  ultimoLogin: string | null;
  company: { id: string; nome: string; slug: string; verificada: boolean } | null;
  _count: { matches: number; opportunities: number };
}

const roleLabels: Record<string, string> = {
  empresa: "Empresa",
  parceiro: "Parceiro",
  admin: "Admin",
};

const roleColors: Record<string, string> = {
  empresa: "bg-blue-100 text-blue-700",
  parceiro: "bg-purple-100 text-purple-700",
  admin: "bg-amber-100 text-amber-700",
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  async function toggleAtivo(user: PlatformUser) {
    setToggling(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !user.ativo }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, ativo: !u.ativo } : u));
    }
    setToggling(null);
  }

  const filtered = users.filter((u) => {
    if (filterRole !== "todos" && u.role !== filterRole) return false;
    if (filterStatus === "ativo" && !u.ativo) return false;
    if (filterStatus === "inativo" && u.ativo) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.company?.nome.toLowerCase().includes(q) ?? false);
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
        <h1 className="text-2xl font-bold text-foreground font-display">Utilizadores da Plataforma</h1>
        <p className="text-muted text-sm mt-1">
          {users.length} utilizador(es) — {users.filter((u) => u.ativo).length} ativos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="todos">Todos os roles</option>
          <option value="empresa">Empresa</option>
          <option value="parceiro">Parceiro</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted">Nenhum utilizador encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider">Utilizador</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Auth</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Atividade</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Registro</th>
                  <th className="py-3 px-4 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{u.nome.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{u.nome}</p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${roleColors[u.role] || "bg-gray-100 text-gray-700"}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {u.company ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-foreground">{u.company.nome}</span>
                          {u.company.verificada && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">V</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {u.googleId ? (
                        <Globe className="w-4 h-4 text-blue-500" />
                      ) : (
                        <span className="text-xs text-muted">Email</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="text-xs text-muted">
                        <span>{u._count.opportunities} oport.</span>
                        <span className="mx-1">·</span>
                        <span>{u._count.matches} matches</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAtivo(u)}
                        disabled={toggling === u.id}
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                          u.ativo
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } ${toggling === u.id ? "opacity-50" : ""}`}
                      >
                        {u.ativo ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {u.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted hidden md:table-cell">
                      {new Date(u.criadoEm).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/admin/usuarios/${u.id}`}
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
