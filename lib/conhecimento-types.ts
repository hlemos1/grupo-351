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
