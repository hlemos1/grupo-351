import { prisma } from "./prisma";

interface SearchResult {
  type: "opportunity" | "company";
  id: string;
  titulo: string;
  subtitulo: string;
  tipo?: string;
  setor?: string;
  verificada?: boolean;
}

export async function searchPlatform(query: string, limit = 20): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const term = query.trim();
  // Escape special characters for LIKE
  const likeTerm = `%${term.replace(/[%_]/g, "\\$&")}%`;

  const [opps, companies] = await Promise.all([
    prisma.opportunity.findMany({
      where: {
        status: "aberta",
        OR: [
          { titulo: { contains: term, mode: "insensitive" } },
          { descricao: { contains: term, mode: "insensitive" } },
          { setor: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        setor: true,
        company: { select: { nome: true, verificada: true } },
      },
      orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
      take: limit,
    }),
    prisma.company.findMany({
      where: {
        ativa: true,
        OR: [
          { nome: { contains: term, mode: "insensitive" } },
          { descricao: { contains: term, mode: "insensitive" } },
          { setor: { contains: term, mode: "insensitive" } },
          { tagline: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        nome: true,
        slug: true,
        setor: true,
        pais: true,
        verificada: true,
        tagline: true,
      },
      orderBy: [{ verificada: "desc" }, { criadoEm: "desc" }],
      take: limit,
    }),
  ]);

  const results: SearchResult[] = [
    ...opps.map((o) => ({
      type: "opportunity" as const,
      id: o.id,
      titulo: o.titulo,
      subtitulo: `${o.company.nome} — ${o.setor}`,
      tipo: o.tipo,
      setor: o.setor,
      verificada: o.company.verificada,
    })),
    ...companies.map((c) => ({
      type: "company" as const,
      id: c.slug,
      titulo: c.nome,
      subtitulo: `${c.setor} — ${c.pais}`,
      setor: c.setor,
      verificada: c.verificada,
    })),
  ];

  return results.slice(0, limit);
}
