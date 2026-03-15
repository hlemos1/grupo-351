import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getParceiroByToken } from "@/lib/parceiro";
import { getProjetos } from "@/lib/projetos";

const COOKIE_NAME = "parceiro_session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenParam = searchParams.get("token");

  // Prioridade: query string (primeiro acesso) > cookie (sessão)
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME)?.value;
  const token = tokenParam || tokenCookie;

  if (!token) {
    return NextResponse.json({ error: "Token obrigatório" }, { status: 401 });
  }

  const parceiro = await getParceiroByToken(token);
  if (!parceiro) {
    // Limpar cookie inválido se existir
    const res = NextResponse.json({ error: "Token inválido ou parceiro inativo" }, { status: 401 });
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  // Buscar dados do projeto associado
  const projetos = await getProjetos();
  const projeto = projetos.find((p) => p.slug === parceiro.projetoSlug);

  const res = NextResponse.json({
    parceiro: {
      nome: parceiro.nome,
      papel: parceiro.papel,
      criadoEm: parceiro.criadoEm,
    },
    projeto: projeto
      ? {
          name: projeto.name,
          tagline: projeto.tagline,
          status: projeto.status,
          mercado: projeto.mercado,
          controle: projeto.controle,
        }
      : null,
    metricas: parceiro.metricas || null,
  });

  // Setar cookie httpOnly seguro (7 dias) — token sai da URL
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  });

  return res;
}
