"use client";

import { useEffect, useState } from "react";
import { Key, Plus, Copy, Trash2, Check, Shield } from "lucide-react";

interface ApiKeyData {
  id: string;
  key: string;
  nome: string;
  scopes: string[];
  ativa: boolean;
  ultimoUso: string | null;
  criadoEm: string;
}

const AVAILABLE_SCOPES = [
  { id: "companies:read", label: "Ler empresas" },
  { id: "opportunities:read", label: "Ler oportunidades" },
  { id: "opportunities:write", label: "Criar oportunidades" },
  { id: "matches:read", label: "Ler matches" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [scopes, setScopes] = useState<string[]>(["companies:read", "opportunities:read"]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    const res = await fetch("/api/platform/api-keys");
    if (res.ok) setKeys(await res.json());
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/platform/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, scopes }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setNewKey(data.key);
      setShowForm(false);
      setNome("");
      setScopes(["companies:read", "opportunities:read"]);
      fetchKeys();
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revogar esta chave? Esta ação não pode ser desfeita.")) return;

    const res = await fetch(`/api/platform/api-keys?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchKeys();
  }

  function toggleScope(scope: string) {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  }

  async function copyKey() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Key className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">API Keys</h1>
            <p className="text-sm text-gray-400">Gerencie o acesso à API pública v1</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova chave
        </button>
      </div>

      {/* New key alert */}
      {newKey && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900">
                Chave criada com sucesso! Copie agora — ela não será exibida novamente.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-800 break-all">
                  {newKey}
                </code>
                <button
                  onClick={copyKey}
                  className="shrink-0 p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="mt-3 text-xs text-emerald-600 hover:text-emerald-800"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-black/[0.04] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da chave</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Integração CRM, App Mobile..."
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissões (scopes)</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SCOPES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleScope(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                    scopes.includes(id)
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    scopes.includes(id) ? "bg-amber-500 border-amber-500" : "border-gray-300"
                  }`}>
                    {scopes.includes(id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating || scopes.length === 0}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-500 transition-all disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar chave"}
            </button>
          </div>
        </form>
      )}

      {/* Keys list */}
      <div className="space-y-3">
        {keys.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-8 text-center">
            <Key className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhuma chave API criada</p>
            <p className="text-xs text-gray-400 mt-1">Requer plano Enterprise</p>
          </div>
        ) : (
          keys.map((k) => (
            <div
              key={k.id}
              className={`bg-white rounded-2xl border border-black/[0.04] p-5 ${
                !k.ativa ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{k.nome}</p>
                    {!k.ativa && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        Revogada
                      </span>
                    )}
                  </div>
                  <code className="text-xs text-gray-400 font-mono mt-1 block">{k.key}</code>
                </div>

                {k.ativa && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Revogar chave"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {k.scopes.map((s) => (
                  <span key={s} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-400">
                <span>Criada: {new Date(k.criadoEm).toLocaleDateString("pt-PT")}</span>
                {k.ultimoUso && (
                  <span>Último uso: {new Date(k.ultimoUso).toLocaleDateString("pt-PT")}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Docs hint */}
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Como usar a API</p>
        <code className="block bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-600">
          curl -H &quot;Authorization: Bearer pk351_xxx&quot; \<br />
          &nbsp;&nbsp;https://grupo351.com/api/v1/companies
        </code>
        <p className="mt-2">
          Endpoints disponíveis: <code>/api/v1/companies</code>, <code>/api/v1/opportunities</code>
        </p>
      </div>
    </div>
  );
}
