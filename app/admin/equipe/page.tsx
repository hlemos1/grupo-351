"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldCheck, Eye, Plus, UserCheck, UserX } from "lucide-react";

interface AdminMember {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo: boolean;
  ultimoLogin: string | null;
  criadoEm: string;
}

const roleLabels: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  viewer: "Visualizador",
};

const roleIcons: Record<string, typeof Shield> = {
  superadmin: ShieldCheck,
  admin: Shield,
  viewer: Eye,
};

const roleColors: Record<string, string> = {
  superadmin: "bg-amber-100 text-amber-700",
  admin: "bg-blue-100 text-blue-700",
  viewer: "bg-gray-100 text-gray-600",
};

export default function EquipePage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", role: "admin" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
        setLoading(false);
      });
  }, []);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Erro ao criar");
        return;
      }

      setMembers((prev) => [{ ...data, ativo: true, ultimoLogin: null, criadoEm: new Date().toISOString() }, ...prev]);
      setShowForm(false);
      setForm({ nome: "", email: "", senha: "", role: "admin" });
    } catch {
      setFormError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Equipe Admin</h1>
          <p className="text-muted text-sm mt-1">{members.length} membro(s) da equipe</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Novo membro</h3>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Nome</label>
              <input type="text" className={inputClass} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Senha</label>
              <input type="password" className={inputClass} value={form.senha} onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))} required minLength={8} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
              <select className={inputClass} value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="admin">Admin</option>
                <option value="viewer">Visualizador</option>
              </select>
            </div>
            {formError && <p className="text-red-500 text-sm col-span-full">{formError}</p>}
            <div className="col-span-full flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-colors disabled:opacity-50">
                {saving ? "Criando..." : "Criar membro"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const RoleIcon = roleIcons[m.role] || Eye;
          return (
            <div key={m.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111d2e] to-[#152d4a] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{m.nome.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{m.nome}</p>
                    <p className="text-xs text-muted">{m.email}</p>
                  </div>
                </div>
                {m.ativo ? (
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <UserX className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full ${roleColors[m.role] || "bg-gray-100 text-gray-600"}`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleLabels[m.role] || m.role}
                </span>
                <div className="text-right">
                  {m.ultimoLogin ? (
                    <p className="text-[10px] text-muted">Último login: {new Date(m.ultimoLogin).toLocaleDateString("pt-PT")}</p>
                  ) : (
                    <p className="text-[10px] text-muted">Nunca entrou</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
