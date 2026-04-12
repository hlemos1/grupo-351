"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  X,
  Save,
  CheckCircle,
  Trash2,
  Star,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { type Artigo, categoriasArtigos, slugify, inputClass } from "./shared";

export function ArtigosTab() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, Artigo>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newArtigo, setNewArtigo] = useState<Artigo>({
    slug: "",
    titulo: "",
    resumo: "",
    conteudo: [""],
    categoria: "tese",
    destaque: false,
  });
  const [error, setError] = useState("");

  const fetchArtigos = useCallback(async () => {
    const res = await fetch("/api/admin/artigos");
    const data = await res.json();
    setArtigos(data);
    const state: Record<string, Artigo> = {};
    data.forEach((a: Artigo) => {
      state[a.slug] = { ...a };
    });
    setEditState(state);
    setDirty({});
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- setState calls are after await (async)
  useEffect(() => {
    fetchArtigos();
  }, [fetchArtigos]);

  function updateField(slug: string, field: keyof Artigo, value: unknown) {
    setEditState((prev) => ({ ...prev, [slug]: { ...prev[slug], [field]: value } }));
    setDirty((prev) => ({ ...prev, [slug]: true }));
  }

  function updateParagrafo(slug: string, idx: number, value: string) {
    setEditState((prev) => {
      const conteudo = [...prev[slug].conteudo];
      conteudo[idx] = value;
      return { ...prev, [slug]: { ...prev[slug], conteudo } };
    });
    setDirty((prev) => ({ ...prev, [slug]: true }));
  }

  function addParagrafo(slug: string) {
    setEditState((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], conteudo: [...prev[slug].conteudo, ""] },
    }));
    setDirty((prev) => ({ ...prev, [slug]: true }));
  }

  function removeParagrafo(slug: string, idx: number) {
    setEditState((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], conteudo: prev[slug].conteudo.filter((_, i) => i !== idx) },
    }));
    setDirty((prev) => ({ ...prev, [slug]: true }));
  }

  async function handleSave(slug: string) {
    setSaving(slug);
    setError("");
    const res = await fetch("/api/admin/artigos", {
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
    await fetchArtigos();
  }

  async function handleDelete(slug: string) {
    const res = await fetch("/api/admin/artigos", {
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
    await fetchArtigos();
  }

  async function handleCreate() {
    if (!newArtigo.titulo.trim()) {
      setError("Título é obrigatório");
      return;
    }
    setError("");
    setSaving("__new__");
    const slug = newArtigo.slug || slugify(newArtigo.titulo);
    const payload = { ...newArtigo, slug, conteudo: newArtigo.conteudo.filter((p) => p.trim()) };
    const res = await fetch("/api/admin/artigos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao criar");
      setSaving(null);
      return;
    }
    setSaving(null);
    setShowNew(false);
    setNewArtigo({
      slug: "",
      titulo: "",
      resumo: "",
      conteudo: [""],
      categoria: "tese",
      destaque: false,
    });
    await fetchArtigos();
  }

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
        <span className="text-sm text-muted">{artigos.length} artigos</span>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-all"
        >
          {showNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showNew ? "Cancelar" : "Novo Artigo"}
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
          <h3 className="font-bold text-foreground">Novo Artigo</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Título
              </label>
              <input
                value={newArtigo.titulo}
                onChange={(e) =>
                  setNewArtigo((p) => ({
                    ...p,
                    titulo: e.target.value,
                    slug: slugify(e.target.value),
                  }))
                }
                className={`mt-1 ${inputClass}`}
                placeholder="Título do artigo"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Categoria
              </label>
              <select
                value={newArtigo.categoria}
                onChange={(e) =>
                  setNewArtigo((p) => ({ ...p, categoria: e.target.value as Artigo["categoria"] }))
                }
                className={`mt-1 ${inputClass}`}
              >
                {categoriasArtigos.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArtigo.destaque}
                  onChange={(e) => setNewArtigo((p) => ({ ...p, destaque: e.target.checked }))}
                  className="rounded"
                />
                Destaque na página
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Resumo
            </label>
            <input
              value={newArtigo.resumo}
              onChange={(e) => setNewArtigo((p) => ({ ...p, resumo: e.target.value }))}
              className={`mt-1 ${inputClass}`}
              placeholder="Resumo curto para listagens"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Parágrafos ({newArtigo.conteudo.length})
              </label>
              <button
                onClick={() => setNewArtigo((p) => ({ ...p, conteudo: [...p.conteudo, ""] }))}
                className="text-xs text-accent hover:text-accent-light flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {newArtigo.conteudo.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    value={p}
                    onChange={(e) => {
                      const c = [...newArtigo.conteudo];
                      c[idx] = e.target.value;
                      setNewArtigo((prev) => ({ ...prev, conteudo: c }));
                    }}
                    rows={2}
                    className={`flex-1 ${inputClass} resize-none`}
                    placeholder={`Parágrafo ${idx + 1}`}
                  />
                  {newArtigo.conteudo.length > 1 && (
                    <button
                      onClick={() =>
                        setNewArtigo((prev) => ({
                          ...prev,
                          conteudo: prev.conteudo.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={saving === "__new__" || !newArtigo.titulo.trim()}
              className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light disabled:opacity-50"
            >
              {saving === "__new__" ? "Criando..." : "Criar Artigo"}
            </button>
          </div>
        </div>
      )}

      {/* Article list */}
      <div className="space-y-3">
        {artigos.map((a) => {
          const isExpanded = expanded === a.slug;
          const state = editState[a.slug];
          if (!state) return null;
          const catColor =
            a.categoria === "tese"
              ? "bg-blue-100 text-blue-700"
              : a.categoria === "modelo"
                ? "bg-emerald-100 text-emerald-700"
                : a.categoria === "case"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-amber-100 text-amber-700";

          return (
            <div
              key={a.slug}
              className={`bg-white rounded-xl border transition-all ${dirty[a.slug] ? "border-accent/30" : "border-border"}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : a.slug)}
                className="w-full flex items-center gap-3 p-5 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-sm">{a.titulo}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${catColor}`}>
                      {a.categoria}
                    </span>
                    {a.destaque && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{a.resumo}</p>
                </div>
                <span className="text-xs text-muted shrink-0">{a.conteudo.length} parágrafos</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border/50 pt-5 space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Título
                      </label>
                      <input
                        value={state.titulo}
                        onChange={(e) => updateField(a.slug, "titulo", e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Categoria
                      </label>
                      <select
                        value={state.categoria}
                        onChange={(e) => updateField(a.slug, "categoria", e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      >
                        {categoriasArtigos.map((c) => (
                          <option key={c} value={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.destaque || false}
                          onChange={(e) =>
                            updateField(a.slug, "destaque", e.target.checked as unknown as string)
                          }
                          className="rounded"
                        />
                        Destaque
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wider">
                      Resumo
                    </label>
                    <input
                      value={state.resumo}
                      onChange={(e) => updateField(a.slug, "resumo", e.target.value)}
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-muted uppercase tracking-wider">
                        Conteúdo ({state.conteudo.length} parágrafos)
                      </label>
                      <button
                        onClick={() => addParagrafo(a.slug)}
                        className="text-xs text-accent hover:text-accent-light flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Adicionar
                      </button>
                    </div>
                    <div className="space-y-2">
                      {state.conteudo.map((p, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea
                            value={p}
                            onChange={(e) => updateParagrafo(a.slug, idx, e.target.value)}
                            rows={2}
                            className={`flex-1 ${inputClass} resize-none`}
                            placeholder={`Parágrafo ${idx + 1}`}
                          />
                          {state.conteudo.length > 1 && (
                            <button
                              onClick={() => removeParagrafo(a.slug, idx)}
                              className="text-red-400 hover:text-red-600 px-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {confirmDelete === a.slug ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-500">Confirmar?</span>
                        <button
                          onClick={() => handleDelete(a.slug)}
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
                        onClick={() => setConfirmDelete(a.slug)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    )}
                    <button
                      onClick={() => handleSave(a.slug)}
                      disabled={!dirty[a.slug] || saving === a.slug}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all ${
                        saved === a.slug
                          ? "bg-success"
                          : dirty[a.slug]
                            ? "bg-primary hover:bg-primary-light"
                            : "bg-muted cursor-not-allowed"
                      }`}
                    >
                      {saving === a.slug ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : saved === a.slug ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saved === a.slug ? "Salvo!" : "Salvar"}
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
