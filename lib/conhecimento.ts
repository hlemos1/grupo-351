import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type { Termo, Artigo } from "./conhecimento-types";
import type { Termo, Artigo } from "./conhecimento-types";

const DATA_DIR = join(process.cwd(), "data");

export function getGlossario(): Termo[] {
  const path = join(DATA_DIR, "glossario.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")) as Termo[];
}

export function getArtigos(): Artigo[] {
  const path = join(DATA_DIR, "artigos.json");
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")) as Artigo[];
}

export function getArtigoBySlug(slug: string): Artigo | undefined {
  return getArtigos().find((a) => a.slug === slug);
}

export function getTermoBySlug(slug: string): Termo | undefined {
  return getGlossario().find((t) => t.slug === slug);
}
