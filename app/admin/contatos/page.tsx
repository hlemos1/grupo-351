"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  MailOpen,
  Archive,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle,
} from "lucide-react";
import type { Contato } from "@/lib/admin-types";

export default function ContatosPage() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNota, setEditingNota] = useState<{ id: string; nota: string } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contatos")
      .then((r) => r.json())
      .then((data) => {
        setContatos(data);
        setLoading(false);
      });
  }, []);

  async function toggleLido(c: Contato) {
    const updated = { ...c, lido: !c.lido };
    setContatos((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    await fetch(`/api/admin/contatos/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lido: !c.lido }),
    });
  }

  async function toggleArquivar(c: Contato) {
    const updated = { ...c, arquivado: !c.arquivado };
    setContatos((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    await fetch(`/api/admin/contatos/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arquivado: !c.arquivado }),
    });
  }

  async function saveNota(id: string, notas: string) {
    setSaving(id);
    await fetch(`/api/admin/contatos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas }),
    });
    setContatos((prev) =>
      prev.map((x) => (x.id === id ? { ...x, notas } : x))
    );
    setSaving(null);
    setEditingNota(null);
  }

  const filtered = contatos.filter((c) => {
    if (!showArchived && c.arquivado) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.mensagem.toLowerCase().includes(q)
      );
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
        <h1 className="text-2xl font-bold text-foreground font-display">Contatos</h1>
        <p className="text-muted text-sm mt-1">
          {contatos.filter((c) => !c.lido).length} não lido(s) de {contatos.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded border-border"
          />
          Mostrar arquivados
        </label>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <p className="text-muted">Nenhum contato encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-xl border transition-all ${
                c.arquivado ? "border-border opacity-60" : c.lido ? "border-border" : "border-accent/30 shadow-sm"
              }`}
            >
              {/* Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-surface/50 transition-colors rounded-xl"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLido(c); }}
                  className="shrink-0"
                  title={c.lido ? "Marcar como não lido" : "Marcar como lido"}
                >
                  {c.lido ? (
                    <MailOpen className="w-5 h-5 text-muted" />
                  ) : (
                    <Mail className="w-5 h-5 text-accent" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${c.lido ? "text-foreground" : "font-semibold text-foreground"}`}>
                      {c.nome}
                    </p>
                    <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded shrink-0">
                      {c.tipo}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">{c.mensagem}</p>
                </div>

                <span className="text-xs text-muted shrink-0 hidden md:block">
                  {new Date(c.criadoEm).toLocaleDateString("pt-PT")}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); toggleArquivar(c); }}
                  className="text-muted hover:text-foreground transition-colors shrink-0"
                  title={c.arquivado ? "Desarquivar" : "Arquivar"}
                >
                  <Archive className="w-4 h-4" />
                </button>

                {expanded === c.id ? (
                  <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                )}
              </div>

              {/* Expanded */}
              {expanded === c.id && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Email</p>
                      <a href={`mailto:${c.email}`} className="text-accent hover:underline">{c.email}</a>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Empresa</p>
                      <p className="text-foreground">{c.empresa || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Orçamento</p>
                      <p className="text-foreground">{c.orcamento || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Mensagem</p>
                    <p className="text-sm text-foreground bg-surface rounded-lg p-3 leading-relaxed">
                      {c.mensagem}
                    </p>
                  </div>

                  {/* Nota */}
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Notas internas</p>
                    {editingNota?.id === c.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editingNota.nota}
                          onChange={(e) => setEditingNota({ id: c.id, nota: e.target.value })}
                          rows={2}
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm resize-none"
                        />
                        <button
                          onClick={() => saveNota(c.id, editingNota.nota)}
                          disabled={saving === c.id}
                          className="px-3 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-light transition-all"
                        >
                          {saving === c.id ? "..." : <Save className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNota({ id: c.id, nota: c.notas || "" })}
                        className="text-sm text-muted hover:text-foreground transition-colors text-left w-full"
                      >
                        {c.notas || "Clique para adicionar nota..."}
                      </button>
                    )}
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
