import { NextResponse } from "next/server";
import crypto from "crypto";

// GET — redireciona para o Google OAuth
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth não configurado" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://grupo351.com";
  const redirectUri = `${baseUrl}/api/platform/auth/google/callback`;

  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    state,
    prompt: "select_account",
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);

  // Guardar state em cookie para validação no callback
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 min
    path: "/",
  });

  return res;
}
