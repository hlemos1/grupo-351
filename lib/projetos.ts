import { readFileSync, existsSync } from "fs";
import { join } from "path";

export interface Projeto {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  detalhes: string[];
  tag: string;
  status: "Em operação" | "Em desenvolvimento" | "Em estruturação";
  mercado: string;
  parceiro?: string;
  controle: string;
  icon: string;
  notasInternas?: string;
  ultimaAtualizacao?: string;
}

const DATA_PATH = join(process.cwd(), "data", "projetos.json");

export function getProjetos(): Projeto[] {
  if (!existsSync(DATA_PATH)) return [];
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Projeto[];
}

export const projetos: Projeto[] = getProjetos();

export function getProjetoBySlug(slug: string): Projeto | undefined {
  return getProjetos().find((p) => p.slug === slug);
}
