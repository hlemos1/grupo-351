"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Copy, Check, ExternalLink } from "lucide-react";
import type { ParceiroData } from "@/lib/parceiro";

export default function ParceirosAdminPage() {
  const [parceiros, setParceiros] = useState<ParceiroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", projetoSlug: "", papel: "operador" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/parceiros")
      .then((r) => r.json())
      .then(setParceiros)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/parceiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }
      const data = await res.json();
      alert(`Parceiro criado!\n\nLink do portal:\n${window.location.origin}${data.portalUrl}`);
      setShowForm(false);
      setForm({ nome: "", email: "", projetoSlug: "", papel: "operador" });
      // Refresh
      const updated = await fetch("/api/admin/parceiros").then((r) => r.json());
      setParceiros(updated);
    } finally {
      setCreating(false);
    }
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/parceiro?token=${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Parceiros</h1>
          <p className="text-muted text-sm mt-1">{parceiros.length} parceiro(s) registrado(s)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo parceiro
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Registrar novo parceiro</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Nome *</label>
              <input
                className={inputClass}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do parceiro"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email *</label>
              <input
                className={inputClass}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@parceiro.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Slug do projeto *</label>
              <input
                className={inputClass}
                value={form.projetoSlug}
                onChange={(e) => setForm({ ...form, projetoSlug: e.target.value })}
                placeholder="strike-studio"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Papel</label>
              <select
                className={inputClass}
                value={form.papel}
                onChange={(e) => setForm({ ...form, papel: e.target.value })}
              >
                <option value="operador">Operador</option>
                <option value="investidor">Investidor</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !form.nome || !form.email || !form.projetoSlug}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-all disabled:opacity-50"
          >
            {creating ? "Criando..." : "Criar e gerar link"}
          </button>
        </div>
      )}

      {/* Table */}
      {parceiros.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Users className="w-10 h-10 text-muted/20 mx-auto mb-4" />
          <p className="text-muted">Nenhum parceiro registrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider">Parceiro</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Projeto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden md:table-cell">Papel</th>
                  <th className="text-left py-3 px-4 font-medium text-muted text-xs uppercase tracking-wider hidden lg:table-cell">Último acesso</th>
                  <th className="py-3 px-4 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {parceiros.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">{p.nome}</p>
                      <p className="text-xs text-muted">{p.email}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-xs text-muted">
                      {p.projetoSlug}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs font-medium text-muted bg-surface px-2 py-1 rounded capitalize">
                        {p.papel}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-muted">
                      {p.ultimoAcesso
                        ? new Date(p.ultimoAcesso).toLocaleDateString("pt-PT")
                        : "Nunca"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLink(p.token)}
                          className="text-muted hover:text-accent transition-colors p-1"
                          title="Copiar link do portal"
                        >
                          {copied === p.token ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={`/parceiro?token=${p.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-accent transition-colors p-1"
                          title="Abrir portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
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
