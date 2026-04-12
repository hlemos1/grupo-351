export interface Termo {
  slug: string;
  termo: string;
  definicao: string;
  categoria: "conceito" | "marca" | "modelo" | "metrica";
}

export interface Artigo {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string[];
  categoria: "tese" | "modelo" | "case" | "guia";
  destaque?: boolean;
}

export const categoriasTermos = ["conceito", "marca", "modelo", "metrica"] as const;
export const categoriasArtigos = ["tese", "modelo", "case", "guia"] as const;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted/40";
