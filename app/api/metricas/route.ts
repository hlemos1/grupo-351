import { NextResponse } from "next/server";
import { getProjetos } from "@/lib/projetos";
import { getGlossario, getArtigos } from "@/lib/conhecimento";

export const revalidate = 3600; // Cache 1 hora

export async function GET() {
  const [projetos, glossario, artigos] = await Promise.all([
    getProjetos(),
    getGlossario(),
    getArtigos(),
  ]);

  const metrics = {
    projetos: {
      total: projetos.length,
      emOperacao: projetos.filter((p) => p.status === "Em operação").length,
      consolidados: projetos.filter((p) => p.status === "Consolidado").length,
      emDesenvolvimento: projetos.filter((p) => p.status === "Em desenvolvimento").length,
    },
    conhecimento: {
      termos: glossario.length,
      artigos: artigos.length,
    },
    ecossistema: {
      marcas: projetos.length,
      paisesAtuacao: 3,
      anosExperiencia: 60,
    },
  };

  return NextResponse.json(metrics);
}
