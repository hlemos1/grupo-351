import { NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    const result = verifyCredentials(email, senha);

    if (!result.valid) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const { token, expires } = createSessionToken(result.nome!);
    const res = NextResponse.json({ success: true, nome: result.nome });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
