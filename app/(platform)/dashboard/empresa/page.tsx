"use client";

import { useEffect, useState } from "react";
import { Building2, Save, CheckCircle } from "lucide-react";

interface CompanyData {
  slug: string;
  nome: string;
  tagline?: string;
  descricao?: string;
  setor: string;
  pais: string;
  cidade?: string;
  website?: string;
  linkedin?: string;
  estagio: string;
  faturamento?: string;
  interesses: string[];
}

const estagios = [
  { value: "ideacao", label: "Ideação" },
  { value: "validacao", label: "Validação" },
  { value: "operando", label: "Em operação" },
  { value: "escala", label: "Escala" },
  { value: "consolidado", label: "Consolidado" },
];

const faixas = [
  { value: "ate-100k", label: "Até 100k EUR" },
  { value: "100k-500k", label: "100k–500k EUR" },
  { value: "500k-1m", label: "500k–1M EUR" },
  { value: "1m-5m", label: "1M–5M EUR" },
  { value: "5m+", label: "5M+ EUR" },
];

const interesseOptions = [
  "expansao", "investimento", "fornecedor", "franquia", "mentoria",
  "tecnologia", "logistica", "marketing", "financeiro", "legal",
];

export default function EmpresaPage() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    nome: "", slug: "", tagline: "", descricao: "", setor: "", pais: "Portugal",
    cidade: "", website: "", linkedin: "", estagio: "operando", faturamento: "",
    interesses: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/platform/me")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(async (u) => {
        if (u.company) {
          const r = await fetch(`/api/platform/companies/${u.company.slug}`);
          if (!r.ok) throw new Error();
          const c = await r.json();
          setCompany(c);
          setForm({
            nome: c.nome, slug: c.slug, tagline: c.tagline || "",
            descricao: c.descricao || "", setor: c.setor, pais: c.pais,
            cidade: c.cidade || "", website: c.website || "",
            linkedin: c.linkedin || "", estagio: c.estagio,
            faturamento: c.faturamento || "", interesses: c.interesses || [],
          });
        } else {
          setIsNew(true);
        }
      })
      .catch(() => { setIsNew(true); })
      .finally(() => setLoading(false));
  }, []);

  function set(field: string, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleInteresse(tag: string) {
    const current = form.interesses;
    set("interesses", current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]);
  }

  function autoSlug(nome: string) {
    return nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      if (isNew) {
        const res = await fetch("/api/platform/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, slug: form.slug || autoSlug(form.nome) }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Erro ao criar empresa");
          return;
        }
        const created = await res.json();
        setCompany(created);
        setIsNew(false);
      } else if (company) {
        const { slug: _, ...updates } = form;
        const res = await fetch(`/api/platform/companies/${company.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Erro ao atualizar");
          return;
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? "Criar empresa" : "Perfil da empresa"}
          </h1>
          <p className="text-sm text-gray-400">
            {isNew ? "Registre sua empresa para acessar o ecossistema" : "Gerencie informações públicas"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.04] p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome da empresa *</label>
            <input
              className={inputClass}
              value={form.nome}
              onChange={(e) => {
                set("nome", e.target.value);
                if (isNew) set("slug", autoSlug(e.target.value));
              }}
              placeholder="Minha Empresa"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL) *</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="minha-empresa"
              disabled={!isNew}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Frase curta sobre a empresa"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={form.descricao}
            onChange={(e) => set("descricao", e.target.value)}
            placeholder="Conte sobre sua empresa, mercado e objetivos"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Setor *</label>
            <input
              className={inputClass}
              value={form.setor}
              onChange={(e) => set("setor", e.target.value)}
              placeholder="Foodtech, SaaS..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">País *</label>
            <input
              className={inputClass}
              value={form.pais}
              onChange={(e) => set("pais", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cidade</label>
            <input
              className={inputClass}
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
              placeholder="Lisboa, Cascais..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label>
            <input
              className={inputClass}
              value={form.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estágio</label>
            <select className={inputClass} value={form.estagio} onChange={(e) => set("estagio", e.target.value)}>
              {estagios.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Faturamento anual</label>
            <select className={inputClass} value={form.faturamento} onChange={(e) => set("faturamento", e.target.value)}>
              <option value="">Prefiro não informar</option>
              {faixas.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Interesses</label>
          <div className="flex flex-wrap gap-2">
            {interesseOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInteresse(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  form.interesses.includes(tag)
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !form.nome || !form.setor || !form.pais}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-500 transition-all disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Salvando..." : saved ? "Salvo" : isNew ? "Criar empresa" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
