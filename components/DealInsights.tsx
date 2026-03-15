"use client";

import { useState } from "react";
import { Brain, Loader2, RefreshCw, Sparkles } from "lucide-react";

interface DealInsightsProps {
  matchId: string;
}

export function DealInsights({ matchId }: DealInsightsProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadInsights() {
    setLoading(true);
    setContent("");

    try {
      const res = await fetch(`/api/platform/matches/${matchId}/insights`);
      if (!res.ok) {
        setContent("Erro ao gerar insights. Tente novamente.");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                text += parsed.text;
                setContent(text);
              }
            } catch {}
          }
        }
      }
      setLoaded(true);
    } catch {
      setContent("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-50/80 to-indigo-50/50 rounded-2xl border border-violet-100/50 p-5 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <Brain className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Insights IA</h3>
        </div>
        <button
          onClick={loadInsights}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors disabled:opacity-50 bg-white/60 px-3 py-1.5 rounded-lg border border-violet-100/50 hover:bg-white/80"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {loaded ? "Regenerar" : "Gerar insights"}
        </button>
      </div>

      {content ? (
        <div className="prose prose-sm prose-gray max-w-none text-sm leading-relaxed whitespace-pre-wrap text-gray-700 relative">
          {content}
        </div>
      ) : !loading ? (
        <div className="flex items-center gap-3 py-3 relative">
          <Sparkles className="w-4 h-4 text-violet-300" />
          <p className="text-xs text-gray-400">Clique em &ldquo;Gerar insights&rdquo; para obter uma análise IA deste match.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 text-xs text-violet-600 py-3 relative">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Analisando match...</span>
        </div>
      )}
    </div>
  );
}
