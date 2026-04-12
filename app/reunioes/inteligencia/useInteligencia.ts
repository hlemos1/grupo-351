"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export interface Thread {
  titulo: string;
  resumo: string;
  participantes: string[];
  tags: string[];
  sentimento: "positivo" | "neutro" | "negativo" | "misto";
  pontosChave: string[];
}

export interface Pessoa {
  nome: string;
  funcao: string;
  participacao: string;
  responsabilidades: string[];
  pontosChave: string[];
}

export interface Acao {
  acao: string;
  responsavel: string;
  prazo: string;
  prioridade: "alta" | "media" | "baixa";
  status: "pendente" | "em_progresso" | "concluida";
  categoria: string;
  reuniao: string;
}

export interface Insight {
  tipo: "tendencia" | "risco" | "oportunidade" | "recomendacao";
  titulo: string;
  descricao: string;
  impacto: "alto" | "medio" | "baixo";
  tags: string[];
}

export interface Analysis {
  meta: { titulo: string; data: string; participantes: string[]; duracao: string };
  threads: Thread[];
  pessoas: Pessoa[];
  acoes: { recentes: Acao[]; resumo: { total: number; pendentes: number; concluidas: number } };
  insights: Insight[];
  contexto: { antecedentes: string[]; proximos_passos: string[] };
}

export type Tab = "threads" | "pessoas" | "acoes" | "insights";

export function useInteligencia() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("threads");
  const [expandedThread, setExpandedThread] = useState<number | null>(null);
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null);
  const [expandedContext, setExpandedContext] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        setLoading(false);
        setError(true);
      });
      return;
    }
    fetch(`/api/reunioes/analise?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [token]);

  const filteredActions = useMemo(() => {
    if (!data) return [];
    return data.acoes.recentes.filter((a) => {
      if (selectedCat && a.categoria !== selectedCat) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.acao.toLowerCase().includes(q) ||
          a.reuniao.toLowerCase().includes(q) ||
          (a.responsavel?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [data, search, selectedCat]);

  return {
    token,
    data,
    loading,
    error,
    tab,
    setTab,
    expandedThread,
    setExpandedThread,
    expandedPerson,
    setExpandedPerson,
    expandedContext,
    setExpandedContext,
    search,
    setSearch,
    selectedCat,
    setSelectedCat,
    filteredActions,
  };
}
