import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createUserSessionToken, USER_COOKIE } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://grupo351.com";

  if (error) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_invalid`);
  }

  // Validar state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_config`);
  }

  const redirectUri = `${baseUrl}/api/platform/auth/google/callback`;

  try {
    // Trocar code por tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("[google-auth] token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=google_token`);
    }

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    // Buscar informações do usuário
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_userinfo`);
    }

    const googleUser = (await userRes.json()) as GoogleUserInfo;

    if (!googleUser.email || !googleUser.email_verified) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_email`);
    }

    // Encontrar ou criar usuário
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.sub },
          { email: googleUser.email.toLowerCase() },
        ],
      },
    });

    if (user) {
      // Atualizar googleId e avatar se necessário
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.sub,
          avatar: user.avatar || googleUser.picture || null,
          ultimoLogin: new Date(),
        },
      });
    } else {
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          nome: googleUser.name || googleUser.email.split("@")[0],
          googleId: googleUser.sub,
          avatar: googleUser.picture || null,
          role: "empresa",
        },
      });
    }

    // Criar sessão
    const { token, expires } = createUserSessionToken({
      id: user.id,
      nome: user.nome,
      role: user.role,
    });

    const res = NextResponse.redirect(`${baseUrl}/dashboard`);

    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    // Limpar state cookie
    res.cookies.delete("oauth_state");

    return res;
  } catch (err) {
    console.error("[google-auth] error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=google_unknown`);
  }
}
