import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Candidatura, Contato } from "./admin-types";
import type { Projeto } from "./projetos";
import type { Termo, Artigo } from "./conhecimento-types";

const DATA_DIR = join(process.cwd(), "data");

let writeLock = Promise.resolve();

function ensureFile(filename: string) {
  const filepath = join(DATA_DIR, filename);
  if (!existsSync(filepath)) {
    writeFileSync(filepath, "[]", "utf-8");
  }
  return filepath;
}

function readJSON<T>(filename: string): T[] {
  const filepath = ensureFile(filename);
  const raw = readFileSync(filepath, "utf-8");
  return JSON.parse(raw) as T[];
}

function writeJSON<T>(filename: string, data: T[]): void {
  const filepath = ensureFile(filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

async function withLock<T>(fn: () => T): Promise<T> {
  const prev = writeLock;
  let resolve: () => void;
  writeLock = new Promise<void>((r) => {
    resolve = r;
  });
  await prev;
  try {
    return fn();
  } finally {
    resolve!();
  }
}

/* ─── Candidaturas ─── */

export function getCandidaturas(): Candidatura[] {
  return readJSON<Candidatura>("candidaturas.json").sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );
}

export async function addCandidatura(
  data: Omit<Candidatura, "id" | "criadoEm" | "status">
): Promise<Candidatura> {
  return withLock(() => {
    const all = readJSON<Candidatura>("candidaturas.json");
    const entry: Candidatura = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      status: "nova",
    };
    all.push(entry);
    writeJSON("candidaturas.json", all);
    return entry;
  });
}

export async function updateCandidatura(
  id: string,
  updates: Partial<Candidatura>
): Promise<Candidatura | null> {
  return withLock(() => {
    const all = readJSON<Candidatura>("candidaturas.json");
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, id: all[idx].id, criadoEm: all[idx].criadoEm };
    writeJSON("candidaturas.json", all);
    return all[idx];
  });
}

export function getCandidaturaById(id: string): Candidatura | undefined {
  return readJSON<Candidatura>("candidaturas.json").find((c) => c.id === id);
}

/* ─── Contatos ─── */

export function getContatos(): Contato[] {
  return readJSON<Contato>("contatos.json").sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );
}

export async function addContato(
  data: Omit<Contato, "id" | "criadoEm" | "lido" | "arquivado">
): Promise<Contato> {
  return withLock(() => {
    const all = readJSON<Contato>("contatos.json");
    const entry: Contato = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      lido: false,
      arquivado: false,
    };
    all.push(entry);
    writeJSON("contatos.json", all);
    return entry;
  });
}

export async function updateContato(
  id: string,
  updates: Partial<Contato>
): Promise<Contato | null> {
  return withLock(() => {
    const all = readJSON<Contato>("contatos.json");
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, id: all[idx].id, criadoEm: all[idx].criadoEm };
    writeJSON("contatos.json", all);
    return all[idx];
  });
}

/* ─── Projetos ─── */

export function getProjetos(): Projeto[] {
  return readJSON<Projeto>("projetos.json");
}

export function getProjetoBySlug(slug: string): Projeto | undefined {
  return getProjetos().find((p) => p.slug === slug);
}

export async function addProjeto(data: Projeto): Promise<Projeto> {
  return withLock(() => {
    const all = readJSON<Projeto>("projetos.json");
    if (all.some((p) => p.slug === data.slug)) {
      throw new Error("Slug já existe");
    }
    const entry: Projeto = {
      ...data,
      ultimaAtualizacao: new Date().toISOString(),
    };
    all.push(entry);
    writeJSON("projetos.json", all);
    return entry;
  });
}

export async function updateProjeto(
  slug: string,
  updates: Partial<Projeto>
): Promise<Projeto | null> {
  return withLock(() => {
    const all = readJSON<Projeto>("projetos.json");
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      ...updates,
      slug: updates.slug || slug,
      ultimaAtualizacao: new Date().toISOString(),
    };
    writeJSON("projetos.json", all);
    return all[idx];
  });
}

export async function deleteProjeto(slug: string): Promise<boolean> {
  return withLock(() => {
    const all = readJSON<Projeto>("projetos.json");
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx === -1) return false;
    all.splice(idx, 1);
    writeJSON("projetos.json", all);
    return true;
  });
}

/* ─── Glossário ─── */

export function getGlossarioDb(): Termo[] {
  return readJSON<Termo>("glossario.json");
}

export async function addTermo(data: Termo): Promise<Termo> {
  return withLock(() => {
    const all = readJSON<Termo>("glossario.json");
    if (all.some((t) => t.slug === data.slug)) {
      throw new Error("Slug já existe");
    }
    all.push(data);
    writeJSON("glossario.json", all);
    return data;
  });
}

export async function updateTermo(slug: string, updates: Partial<Termo>): Promise<Termo | null> {
  return withLock(() => {
    const all = readJSON<Termo>("glossario.json");
    const idx = all.findIndex((t) => t.slug === slug);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, slug: updates.slug || slug };
    writeJSON("glossario.json", all);
    return all[idx];
  });
}

export async function deleteTermo(slug: string): Promise<boolean> {
  return withLock(() => {
    const all = readJSON<Termo>("glossario.json");
    const idx = all.findIndex((t) => t.slug === slug);
    if (idx === -1) return false;
    all.splice(idx, 1);
    writeJSON("glossario.json", all);
    return true;
  });
}

/* ─── Artigos ─── */

export function getArtigosDb(): Artigo[] {
  return readJSON<Artigo>("artigos.json");
}

export async function addArtigo(data: Artigo): Promise<Artigo> {
  return withLock(() => {
    const all = readJSON<Artigo>("artigos.json");
    if (all.some((a) => a.slug === data.slug)) {
      throw new Error("Slug já existe");
    }
    all.push(data);
    writeJSON("artigos.json", all);
    return data;
  });
}

export async function updateArtigo(slug: string, updates: Partial<Artigo>): Promise<Artigo | null> {
  return withLock(() => {
    const all = readJSON<Artigo>("artigos.json");
    const idx = all.findIndex((a) => a.slug === slug);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, slug: updates.slug || slug };
    writeJSON("artigos.json", all);
    return all[idx];
  });
}

export async function deleteArtigo(slug: string): Promise<boolean> {
  return withLock(() => {
    const all = readJSON<Artigo>("artigos.json");
    const idx = all.findIndex((a) => a.slug === slug);
    if (idx === -1) return false;
    all.splice(idx, 1);
    writeJSON("artigos.json", all);
    return true;
  });
}
