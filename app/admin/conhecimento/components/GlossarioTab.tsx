"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  X,
  Save,
  CheckCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { type Termo, categoriasTermos, slugify, inputClass } from "./shared";

export function GlossarioTab() {
  const [termos, setTermos] = useState<Termo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, Termo>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newTermo, setNewTermo] = useState<Termo>({
    slug: "",
    termo: "",
    definicao: "",
    categoria: "conceito",
  });
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const fetchTermos = useCallback(async () => {
    const res = await fetch("/api/admin/glossario");
    const data = await res.json();
    setTermos(data);
    const state: Record<string, Termo> = {};
    data.forEach((t: Termo) => {
      state[t.slug] = { ...t };
    });
    setEditState(state);
    setDirty({});
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- setState calls are after await (async)
  useEffect(() => {
    fetchTermos();
  }, [fetchTermos]);

  function updateField(slug: string, field: keyof Termo, value: string) {
    setEditState((prev) => ({ ...prev, [slug]: { ...prev[slug], [field]: value } }));
    setDirty((prev) => ({ ...prev, [slug]: true }));
  }

  async function handleSave(slug: string) {
    setSaving(slug);
    setError("");
    const res = await fetch("/api/admin/glossario", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editState[slug]),
    });
    if (!res.ok) {
      setError("Erro ao salvar");
      setSaving(null);
      return;
    }
    setDirty((prev) => ({ ...prev, [slug]: false }));
    setSaving(null);
    setSaved(slug);
    setTimeout(() => setSaved(null), 2500);
    await fetchTermos();
  }

  async function handleDelete(slug: string) {
    const res = await fetch("/api/admin/glossario", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) {
      setError("Erro ao excluir");
      return;
    }
    setConfirmDelete(null);
    setExpanded(null);
    await fetchTermos();
  }

  async function handleCreate() {
    if (!newTermo.termo.trim()) {
      setError("Termo é obrigatório");
      return;
    }
    setError("");
    setSaving("__new__");
    const slug = newTermo.slug || slugify(newTermo.termo);
    const res = await fetch("/api/admin/glossario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTermo, slug }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao criar");
      setSaving(null);
      return;
    }
    setSaving(null);
    setShowNew(false);
    setNewTermo({ slug: "", termo: "", definicao: "", categoria: "conceito" });
    await fetchTermos();
  }

  const filtered = filter === "all" ? termos : termos.filter((t) => t.categoria === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{termos.length} termos</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-surface text-foreground"
          >
            <option value="all">Todas categorias</option>
            {categoriasTermos.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-all"
        >
          {showNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showNew ? "Cancelar" : "Novo Termo"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-lg text-sm">
          <AlertTriangle className="w-4 h-4" /> {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showNew && (
        <div className="bg-white rounded-xl border-2 border-accent/20 p-5 space-y-3">
          <h3 className="font-bold text-foreground">Novo Termo</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Termo
              </label>
              <input
                value={newTermo.termo}
                onChange={(e) =>
                  setNewTermo((p) => ({
                    ...p,
                    termo: e.target.value,
                    slug: slugify(e.target.value),
                  }))
                }
                className={`mt-1 ${inputClass}`}
                placeholder="Nome do termo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Slug
              </label>
              <input
                value={newTermo.slug}
                onChange={(e) => setNewTermo((p) => ({ ...p, slug: e.target.value }))}
                className={`mt-1 ${inputClass} text-muted`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Categoria
              </label>
              <select
                value={newTermo.categoria}
                onChange={(e) =>
                  setNewTermo((p) => ({ ...p, categoria: e.target.value as Termo["categoria"] }))
                }
                className={`mt-1 ${inputClass}`}
              >
                {categoriasTermos.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Definição
            </label>
            <textarea
              value={newTermo.definicao}
              onChange={(e) => setNewTermo((p) => ({ ...p, definicao: e.target.value }))}
              rows={3}
              className={`mt-1 ${inputClass} resize-none`}
              placeholder="Definição do termo..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={saving === "__new__" || !newTermo.termo.trim()}
              className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light disabled:opacity-50"
            >
              {saving === "__new__" ? "Criando..." : "Criar Termo"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((t) => {
          const isExpanded = expanded === t.slug;
          const state = editState[t.slug];
          if (!state) return null;
          const catColor =
            t.categoria === "conceito"
              ? "bg-blue-100 text-blue-700"
              : t.categoria === "marca"
                ? "bg-purple-100 text-purple-700"
                : t.categoria === "modelo"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700";

          return (
            <div
              key={t.slug}
              className={`bg-white rounded-xl border transition-all ${dirty[t.slug] ? "border-accent/30" : "border-border"}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : t.slug)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{t.termo}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${catColor}`}>
                      {t.categoria}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5">{t.definicao}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4 space-y-3">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Termo
                      </label>
                      <input
                        value={state.termo}
                        onChange={(e) => updateField(t.slug, "termo", e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Slug
                      </label>
                      <input
                        value={state.slug}
                        onChange={(e) => updateField(t.slug, "slug", e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Categoria
                      </label>
                      <select
                        value={state.categoria}
                        onChange={(e) => updateField(t.slug, "categoria", e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      >
                        {categoriasTermos.map((c) => (
                          <option key={c} value={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wider">
                      Definição
                    </label>
                    <textarea
                      value={state.definicao}
                      onChange={(e) => updateField(t.slug, "definicao", e.target.value)}
                      rows={3}
                      className={`mt-1 ${inputClass} resize-none`}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {confirmDelete === t.slug ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-500">Confirmar?</span>
                        <button
                          onClick={() => handleDelete(t.slug)}
                          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(t.slug)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    )}
                    <button
                      onClick={() => handleSave(t.slug)}
                      disabled={!dirty[t.slug] || saving === t.slug}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                        saved === t.slug
                          ? "bg-success"
                          : dirty[t.slug]
                            ? "bg-primary hover:bg-primary-light"
                            : "bg-muted cursor-not-allowed"
                      }`}
                    >
                      {saving === t.slug ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : saved === t.slug ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saved === t.slug ? "Salvo!" : "Salvar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Artigos Tab ─── */
