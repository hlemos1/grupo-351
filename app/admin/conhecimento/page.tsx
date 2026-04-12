"use client";

import { useState } from "react";
import { BookOpen, FileText } from "lucide-react";
import { GlossarioTab } from "./components/GlossarioTab";
import { ArtigosTab } from "./components/ArtigosTab";

type Tab = "glossario" | "artigos";

export default function ConhecimentoAdminPage() {
  const [tab, setTab] = useState<Tab>("glossario");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Conhecimento</h1>
        <p className="text-muted text-sm mt-1">
          Gerencie o glossario e os artigos da base de conhecimento
        </p>
      </div>

      <div className="flex gap-1 bg-surface rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("glossario")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "glossario"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Glossario
        </button>
        <button
          onClick={() => setTab("artigos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "artigos"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Artigos
        </button>
      </div>

      {tab === "glossario" ? <GlossarioTab /> : <ArtigosTab />}
    </div>
  );
}
