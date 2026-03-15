"use client";

import { useEffect, useState } from "react";
import { CreditCard, Check, ArrowRight, Settings, Sparkles, Receipt, FileText } from "lucide-react";

interface PlanData {
  id: string;
  nome: string;
  preco: number;
  features: string[];
  limites: { oportunidades: number; matchesIA: boolean; apiAccess: boolean; membros: number };
}

interface BillingData {
  currentPlan: string;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  plans: PlanData[];
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  tipo: string;
  descricao: string | null;
  criadoEm: string;
}

export default function PlanoPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<"planos" | "faturas">("planos");

  useEffect(() => {
    Promise.all([
      fetch("/api/platform/billing").then((r) => r.json()),
      fetch("/api/platform/billing/invoices").then((r) => r.json()),
    ]).then(([billing, inv]) => {
      setData(billing);
      setInvoices(inv.invoices || []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleCheckout(planId: string) {
    setActionLoading(planId);
    try {
      const res = await fetch("/api/platform/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout", planId }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else if (error) alert(error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleManage() {
    setActionLoading("manage");
    try {
      const res = await fetch("/api/platform/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "manage" }),
      });
      const { url, error } = await res.json();
      if (url) window.location.href = url;
      else if (error) alert(error);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const currentPlanData = data.plans.find((p) => p.id === data.currentPlan);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Plano e faturamento</h1>
          <p className="text-sm text-gray-400">
            Plano atual: <span className="font-medium text-gray-600 capitalize">{data.currentPlan}</span>
          </p>
        </div>
      </div>

      {/* Subscription info + limits */}
      {data.subscription && (
        <div className="bg-white rounded-2xl border border-black/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium capitalize">{data.subscription.status}</span>
              </p>
              {data.subscription.currentPeriodEnd && (
                <p className="text-xs text-gray-400 mt-1">
                  {data.subscription.cancelAtPeriodEnd ? "Cancela em" : "Renova em"}{" "}
                  {new Date(data.subscription.currentPeriodEnd).toLocaleDateString("pt-PT")}
                </p>
              )}
            </div>
            <button
              onClick={handleManage}
              disabled={actionLoading === "manage"}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <Settings className="w-4 h-4" />
              Gerir assinatura
            </button>
          </div>
          {currentPlanData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-black/[0.04]">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {currentPlanData.limites.oportunidades === -1 ? "Ilim." : currentPlanData.limites.oportunidades}
                </p>
                <p className="text-[11px] text-gray-500">Oportunidades</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {currentPlanData.limites.membros === -1 ? "Ilim." : currentPlanData.limites.membros}
                </p>
                <p className="text-[11px] text-gray-500">Membros</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{currentPlanData.limites.matchesIA ? "Sim" : "Não"}</p>
                <p className="text-[11px] text-gray-500">Matches IA</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{currentPlanData.limites.apiAccess ? "Sim" : "Não"}</p>
                <p className="text-[11px] text-gray-500">API</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("planos")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "planos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Planos
        </button>
        <button
          onClick={() => setTab("faturas")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "faturas" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Receipt className="w-3.5 h-3.5 inline mr-1" />
          Faturas ({invoices.length})
        </button>
      </div>

      {tab === "planos" && (
        <div className="grid md:grid-cols-3 gap-4">
          {data.plans.map((plan) => {
            const isCurrent = plan.id === data.currentPlan;
            const isPopular = plan.id === "growth";

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 relative ${
                  isPopular
                    ? "border-amber-300 bg-amber-50/30 shadow-lg shadow-amber-500/5"
                    : "border-black/[0.04] bg-white"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  </div>
                )}

                <h3 className="font-semibold text-gray-900 text-lg">{plan.nome}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.preco === 0 ? "Grátis" : `${plan.preco / 100}€`}
                  </span>
                  {plan.preco > 0 && <span className="text-sm text-gray-400">/mês</span>}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="w-full text-center py-2.5 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium">
                    Plano atual
                  </div>
                ) : plan.preco === 0 ? (
                  <div className="w-full text-center py-2.5 rounded-lg bg-gray-50 text-gray-400 text-sm">
                    Incluído
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={actionLoading === plan.id}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                      isPopular
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {actionLoading === plan.id ? "Processando..." : "Assinar"}
                    {!actionLoading && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "faturas" && (
        <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.04] bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Data</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Descrição</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Valor</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(inv.criadoEm).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-medium">
                      {inv.descricao || inv.tipo}
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-medium">
                      {(inv.amount / 100).toFixed(2)} {inv.currency.toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        inv.status === "succeeded" ? "bg-emerald-50 text-emerald-700" :
                        inv.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {inv.status === "succeeded" ? "Pago" : inv.status === "pending" ? "Pendente" : "Falhou"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
