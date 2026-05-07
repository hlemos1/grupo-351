/**
 * Upsert idempotente do portfolio: data/projetos.json -> Neon via Prisma.
 *
 * Estrategia:
 *  - upsert por slug (create se nao existe, update se existe)
 *  - legacy slug map (ex: farmlab-3d -> fixxe3d) renomeia preservando ID
 *  - projetos no banco mas nao no JSON: status="Arquivado" (nao deleta)
 *  - candidaturas com slug legacy: array_replace via SQL
 *
 * Modos:
 *   pnpm tsx scripts/upsert-portfolio.ts                 # dry-run (default)
 *   pnpm tsx scripts/upsert-portfolio.ts --apply         # executa
 *   pnpm tsx scripts/upsert-portfolio.ts --apply --confirm-prod  # warning extra prod
 *
 * Antes de --apply em PROD:
 *   1. Backup/branch do Neon
 *   2. Confirmar DATABASE_URL aponta pro ambiente certo
 *   3. Rodar dry-run primeiro pra revisar plano
 */

import { readFileSync } from "fs";
import { join } from "path";
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

const DATA_DIR = join(process.cwd(), "data");

/** Slugs renomeados: { slugAntigo: slugNovo }. */
const LEGACY_SLUG_MAP: Record<string, string> = {
  "farmlab-3d": "fixxe3d",
};

interface ProjetoInput {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  detalhes: string[];
  tag: string;
  status: string;
  mercado: string;
  parceiro?: string;
  controle: string;
  icon: string;
  socio?: string;
  porcentagem?: number;
  notasInternas?: string;
  camada?: string;
}

interface Plan {
  toCreate: ProjetoInput[];
  toUpdate: { slug: string; data: ProjetoInput }[];
  toRename: { fromSlug: string; toSlug: string; data: ProjetoInput }[];
  toArchive: { slug: string; currentStatus: string }[];
  candidaturasToUpdate: { fromSlug: string; toSlug: string; affected: number }[];
}

function readJSON<T>(filename: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), "utf-8")) as T;
}

function projetoData(p: ProjetoInput) {
  return {
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    detalhes: p.detalhes,
    tag: p.tag,
    status: p.status,
    mercado: p.mercado,
    parceiro: p.parceiro ?? null,
    controle: p.controle,
    icon: p.icon,
    socio: p.socio ?? null,
    porcentagem: p.porcentagem ?? null,
    notasInternas: p.notasInternas ?? null,
    ultimaAtualizacao: new Date(),
  };
}

async function buildPlan(prisma: PrismaClient, jsonProjects: ProjetoInput[]): Promise<Plan> {
  const dbProjects = await prisma.projeto.findMany();
  const dbBySlug = new Map(dbProjects.map((p) => [p.slug, p]));
  const jsonBySlug = new Map(jsonProjects.map((p) => [p.slug, p]));

  const plan: Plan = {
    toCreate: [],
    toUpdate: [],
    toRename: [],
    toArchive: [],
    candidaturasToUpdate: [],
  };

  // 1. Legacy slug renames (farmlab-3d -> fixxe3d, etc.)
  for (const [oldSlug, newSlug] of Object.entries(LEGACY_SLUG_MAP)) {
    const newData = jsonBySlug.get(newSlug);
    if (!newData) continue; // novo slug nao esta no JSON, pular

    const oldExists = dbBySlug.has(oldSlug);
    const newExists = dbBySlug.has(newSlug);

    if (oldExists && !newExists) {
      // caso 1: renomear preservando ID (slug e PK)
      plan.toRename.push({ fromSlug: oldSlug, toSlug: newSlug, data: newData });
      // remove dos mapas pra nao reprocessar
      dbBySlug.delete(oldSlug);
      jsonBySlug.delete(newSlug);
    } else if (oldExists && newExists) {
      // caso 2: ambos existem -> arquivar antigo, atualizar novo
      plan.toArchive.push({ slug: oldSlug, currentStatus: dbBySlug.get(oldSlug)!.status });
      plan.toUpdate.push({ slug: newSlug, data: newData });
      dbBySlug.delete(oldSlug);
      dbBySlug.delete(newSlug);
      jsonBySlug.delete(newSlug);
    }
    // se !oldExists, deixa o flow normal criar o newSlug abaixo

    // candidaturas referenciam o slug antigo
    const affected = await prisma.candidatura.count({
      where: { modelo: { has: oldSlug } },
    });
    if (affected > 0) {
      plan.candidaturasToUpdate.push({ fromSlug: oldSlug, toSlug: newSlug, affected });
    }
  }

  // 2. Create / update normais
  for (const [slug, data] of jsonBySlug) {
    if (dbBySlug.has(slug)) {
      plan.toUpdate.push({ slug, data });
      dbBySlug.delete(slug);
    } else {
      plan.toCreate.push(data);
    }
  }

  // 3. Restantes no DB (nao no JSON, nao legacy mapped) -> arquivar
  for (const [slug, dbProj] of dbBySlug) {
    if (dbProj.status === "Arquivado") continue; // ja arquivado
    plan.toArchive.push({ slug, currentStatus: dbProj.status });
  }

  return plan;
}

function printPlan(plan: Plan, dbUrl: string) {
  console.log("\n" + "=".repeat(70));
  console.log(" PLANO DE UPSERT — PORTFOLIO");
  console.log("=".repeat(70));
  console.log(` Banco: ${dbUrl.replace(/:[^:@]+@/, ":***@")}`);
  console.log("=".repeat(70));

  console.log(`\n CREATE (${plan.toCreate.length})`);
  for (const p of plan.toCreate) {
    console.log(`   + ${p.slug.padEnd(24)} ${p.name}`);
  }

  console.log(`\n UPDATE (${plan.toUpdate.length})`);
  for (const u of plan.toUpdate) {
    console.log(`   ~ ${u.slug.padEnd(24)} ${u.data.name}`);
  }

  console.log(`\n RENAME (${plan.toRename.length})`);
  for (const r of plan.toRename) {
    console.log(`   > ${r.fromSlug.padEnd(24)} -> ${r.toSlug.padEnd(20)} (${r.data.name})`);
  }

  console.log(`\n ARCHIVE (${plan.toArchive.length})`);
  for (const a of plan.toArchive) {
    console.log(`   ! ${a.slug.padEnd(24)} ${a.currentStatus} -> Arquivado`);
  }

  console.log(`\n CANDIDATURAS (${plan.candidaturasToUpdate.length})`);
  for (const c of plan.candidaturasToUpdate) {
    console.log(`   * ${c.fromSlug} -> ${c.toSlug} (${c.affected} candidaturas)`);
  }

  console.log("\n" + "=".repeat(70));
}

async function applyPlan(prisma: PrismaClient, plan: Plan) {
  // Transacao garante atomicidade. Se algo falhar, rollback completo.
  await prisma.$transaction(async (tx) => {
    // 1. Renames primeiro (UPDATE PK via SQL)
    for (const r of plan.toRename) {
      const d = projetoData(r.data);
      await tx.$executeRaw`
        UPDATE projetos SET
          slug = ${r.toSlug},
          name = ${d.name},
          tagline = ${d.tagline},
          description = ${d.description},
          detalhes = ${d.detalhes}::text[],
          tag = ${d.tag},
          status = ${d.status},
          mercado = ${d.mercado},
          parceiro = ${d.parceiro},
          controle = ${d.controle},
          icon = ${d.icon},
          socio = ${d.socio},
          porcentagem = ${d.porcentagem},
          notas_internas = ${d.notasInternas},
          ultima_atualizacao = NOW()
        WHERE slug = ${r.fromSlug}
      `;
      console.log(`  > renamed ${r.fromSlug} -> ${r.toSlug}`);
    }

    // 2. Updates
    for (const u of plan.toUpdate) {
      await tx.projeto.update({
        where: { slug: u.slug },
        data: projetoData(u.data),
      });
      console.log(`  ~ updated ${u.slug}`);
    }

    // 3. Creates
    for (const p of plan.toCreate) {
      await tx.projeto.create({
        data: { slug: p.slug, ...projetoData(p) },
      });
      console.log(`  + created ${p.slug}`);
    }

    // 4. Archives
    for (const a of plan.toArchive) {
      await tx.projeto.update({
        where: { slug: a.slug },
        data: { status: "Arquivado", ultimaAtualizacao: new Date() },
      });
      console.log(`  ! archived ${a.slug}`);
    }

    // 5. Candidaturas: array_replace por slug legacy
    for (const c of plan.candidaturasToUpdate) {
      const result = await tx.$executeRaw`
        UPDATE candidaturas
        SET modelo = array_replace(modelo, ${c.fromSlug}, ${c.toSlug})
        WHERE ${c.fromSlug} = ANY(modelo)
      `;
      console.log(`  * candidaturas: ${c.fromSlug} -> ${c.toSlug} (${result} rows)`);
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const confirmProd = args.includes("--confirm-prod");

  neonConfig.webSocketConstructor = ws;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL env var required");
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString: dbUrl });
  const prisma = new PrismaClient({ adapter } as never);

  try {
    const jsonProjects = readJSON<ProjetoInput[]>("projetos.json");
    console.log(`Loaded ${jsonProjects.length} projects from data/projetos.json`);

    const plan = await buildPlan(prisma, jsonProjects);
    printPlan(plan, dbUrl);

    if (!apply) {
      console.log("\nDRY-RUN ONLY. Use --apply to execute changes.\n");
      return;
    }

    const delay = confirmProd ? 10 : 5;
    console.log(
      `\nApplying in ${delay} seconds... (Ctrl+C to cancel)\nDB host: ${
        new URL(dbUrl.replace(/^postgres(ql)?\+?/, "https://")).host
      }`
    );
    if (confirmProd) {
      console.log("WARNING: --confirm-prod flag set. This will modify production.");
    }
    await new Promise((r) => setTimeout(r, delay * 1000));

    console.log("\nApplying...");
    await applyPlan(prisma, plan);
    console.log("\nDone.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Upsert failed:", err);
  process.exit(1);
});
