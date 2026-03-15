"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: Record<string, string>) => void;
  setores?: string[];
  paises?: string[];
}

const tipos = [
  { value: "", label: "Todos" },
  { value: "franquia", label: "Franquia" },
  { value: "investimento", label: "Investimento" },
  { value: "parceria", label: "Parceria" },
  { value: "fornecedor", label: "Fornecedor" },
  { value: "expansao", label: "Expansão" },
];

export function FilterPanel({ onFilterChange, setores = [], paises = [] }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  function update(key: string, value: string) {
    const next = { ...filters, [key]: value };
    if (!value) delete next[key];
    setFilters(next);
    onFilterChange(next);
  }

  function clear() {
    setFilters({});
    onFilterChange({});
  }

  const activeCount = Object.keys(filters).length;
  const selectClass = "px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeCount > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Filter className="w-4 h-4" />
        Filtros
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-900">Filtros</p>
            {activeCount > 0 && (
              <button onClick={clear} className="text-[10px] text-red-500 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              className={selectClass}
              value={filters.tipo || ""}
              onChange={(e) => update("tipo", e.target.value)}
            >
              {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            {setores.length > 0 && (
              <select
                className={selectClass}
                value={filters.setor || ""}
                onChange={(e) => update("setor", e.target.value)}
              >
                <option value="">Setor</option>
                {setores.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {paises.length > 0 && (
              <select
                className={selectClass}
                value={filters.pais || ""}
                onChange={(e) => update("pais", e.target.value)}
              >
                <option value="">País</option>
                {paises.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            )}

            <select
              className={selectClass}
              value={filters.verificada || ""}
              onChange={(e) => update("verificada", e.target.value)}
            >
              <option value="">Verificação</option>
              <option value="true">Verificada</option>
              <option value="false">Não verificada</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
