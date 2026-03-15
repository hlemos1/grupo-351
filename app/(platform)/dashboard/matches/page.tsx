"use client";

import { useEffect, useState } from "react";
import { GitMerge, Check, X, MessageCircle, Sparkles, Send } from "lucide-react";

interface Match {
  id: string;
  status: string;
  score: number | null;
  motivo: string | null;
  criadoEm: string;
  opportunity: { id: string; titulo: string; tipo: string };
  fromUser: { id: string; nome: string };
  toUser: { id: string; nome: string };
}

interface Message {
  id: string;
  conteudo: string;
  criadoEm: string;
  user: { id: string; nome: string };
}

interface Suggestion {
  opportunityId: string;
  titulo: string;
  tipo: string;
  score: number;
  motivo: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  sugerido: { label: "Pendente", color: "bg-amber-50 text-amber-700" },
  aceito: { label: "Aceito", color: "bg-emerald-50 text-emerald-700" },
  recusado: { label: "Recusado", color: "bg-red-50 text-red-700" },
  "em-conversa": { label: "Em conversa", color: "bg-blue-50 text-blue-700" },
  fechado: { label: "Projeto criado", color: "bg-purple-50 text-purple-700" },
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [myUserId, setMyUserId] = useState("");
  const [tab, setTab] = useState<"matches" | "sugestoes">("matches");

  useEffect(() => {
    Promise.all([
      fetch("/api/platform/matches").then((r) => r.json()),
      fetch("/api/platform/matches/suggest").then((r) => r.json()),
      fetch("/api/platform/me").then((r) => r.json()),
    ])
      .then(([m, s, me]) => {
        setMatches(Array.isArray(m) ? m : []);
        setSuggestions(Array.isArray(s) ? s : []);
        setMyUserId(me.id);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(matchId: string, action: "aceitar" | "recusar") {
    await fetch("/api/platform/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, action }),
    });
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, status: action === "aceitar" ? "aceito" : "recusado" } : m
      )
    );
  }

  async function openChat(matchId: string) {
    setActiveChat(matchId);
    const msgs = await fetch(`/api/platform/messages?matchId=${matchId}`).then((r) => r.json());
    setMessages(Array.isArray(msgs) ? msgs : []);
  }

  async function sendMessage() {
    if (!activeChat || !newMsg.trim()) return;
    const res = await fetch("/api/platform/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: activeChat, conteudo: newMsg }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMsg("");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <GitMerge className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Matches</h1>
          <p className="text-sm text-gray-400">Conexões e sugestões do ecossistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: "matches" as const, label: `Meus matches (${matches.length})` },
          { key: "sugestoes" as const, label: `Sugestões IA (${suggestions.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chat overlay */}
      {activeChat && (
        <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">Conversa</span>
            </div>
            <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-300 text-sm py-8">Nenhuma mensagem ainda. Inicie a conversa.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.user.id === myUserId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.user.id === myUserId
                      ? "bg-amber-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}>
                    <p className="text-[10px] opacity-60 mb-0.5">{msg.user.nome}</p>
                    <p>{msg.conteudo}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Escreva uma mensagem..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <button onClick={sendMessage} className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-500 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Matches tab */}
      {tab === "matches" && (
        matches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-12 text-center">
            <GitMerge className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Nenhum match ainda.</p>
            <p className="text-gray-300 text-xs mt-1">Publique oportunidades ou aguarde sugestões.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const isReceived = match.toUser.id === myUserId;
              const otherName = isReceived ? match.fromUser.nome : match.toUser.nome;
              const st = statusLabels[match.status] || statusLabels.sugerido;

              return (
                <div key={match.id} className="bg-white rounded-2xl border border-black/[0.04] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{match.opportunity.titulo}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isReceived ? "Sugerido por" : "Enviado para"}: {otherName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.score != null && (
                        <span className="text-xs font-medium text-gray-500">{match.score}%</span>
                      )}
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>

                  {match.motivo && (
                    <p className="text-xs text-gray-500 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
                      <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                      {match.motivo}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    {match.status === "sugerido" && isReceived && (
                      <>
                        <button
                          onClick={() => handleAction(match.id, "aceitar")}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-500 transition-all"
                        >
                          <Check className="w-3 h-3" /> Aceitar
                        </button>
                        <button
                          onClick={() => handleAction(match.id, "recusar")}
                          className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all"
                        >
                          <X className="w-3 h-3" /> Recusar
                        </button>
                      </>
                    )}
                    {["aceito", "em-conversa"].includes(match.status) && (
                      <button
                        onClick={() => openChat(match.id)}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500 transition-all"
                      >
                        <MessageCircle className="w-3 h-3" /> Conversar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Sugestões tab */}
      {tab === "sugestoes" && (
        suggestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/[0.04] p-12 text-center">
            <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Sem sugestões no momento.</p>
            <p className="text-gray-300 text-xs mt-1">Complete o perfil da empresa para receber sugestões.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.opportunityId} className="bg-white rounded-2xl border border-black/[0.04] p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{s.titulo}</h3>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-medium text-amber-600">{s.score}%</span>
                    <span className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded">{s.tipo}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                  {s.motivo}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
