"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Upload, FileText, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface Doc {
  id: string;
  tipo: string;
  nome: string;
  url: string;
  status: string;
  criadoEm: string;
}

const tipoLabels: Record<string, string> = {
  nif: "NIF / NIPC",
  certidao: "Certidão Comercial",
  contrato: "Contrato Social",
  outro: "Outro",
};

const statusIcons: Record<string, React.ReactNode> = {
  pendente: <Clock className="w-4 h-4 text-amber-500" />,
  aprovado: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  rejeitado: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function VerificacaoPage() {
  const [verificada, setVerificada] = useState(false);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ tipo: "nif", nome: "", url: "" });

  function load() {
    fetch("/api/platform/verification")
      .then((r) => r.json())
      .then((data) => {
        setVerificada(data.verificada || false);
        setDocuments(data.documents || []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/platform/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao submeter");
        return;
      }
      setSuccess("Documento submetido para análise");
      setForm({ tipo: "nif", nome: "", url: "" });
      load();
      setTimeout(() => setSuccess(""), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Verificação da Empresa</h1>
          <p className="text-sm text-gray-400">
            {verificada
              ? "Empresa verificada"
              : "Submeta documentos para verificar a sua empresa"}
          </p>
        </div>
      </div>

      {verificada && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">Empresa verificada</p>
            <p className="text-xs text-emerald-600">O selo de verificação aparece no perfil público da sua empresa.</p>
          </div>
        </div>
      )}

      {!verificada && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/[0.04] p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-gray-900">Submeter documento</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
              <select className={inputClass} value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}>
                {Object.entries(tipoLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome do ficheiro *</label>
              <input className={inputClass} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: NIF_empresa.pdf" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL do ficheiro *</label>
              <input className={inputClass} type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://drive.google.com/..." required />
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Faça upload do documento no Google Drive ou outro serviço e cole o link público aqui.</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm">{success}</p>}
          <button type="submit" disabled={submitting} className="bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-500 transition-all disabled:opacity-50">
            {submitting ? "Submetendo..." : "Submeter documento"}
          </button>
        </form>
      )}

      {/* Documents list */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
          <div className="px-5 py-3 border-b border-black/[0.04]">
            <h3 className="text-sm font-semibold text-gray-900">Documentos submetidos</h3>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {documents.map((doc) => (
              <div key={doc.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                    <p className="text-xs text-gray-400">{tipoLabels[doc.tipo] || doc.tipo} — {new Date(doc.criadoEm).toLocaleDateString("pt-PT")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcons[doc.status]}
                  <span className="text-xs text-gray-600 capitalize">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
