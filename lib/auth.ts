import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "k7x9m2p4w6q8r3t5v1n0j8h6f4d2s0a";
const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Admin credentials
const ADMINS = [
  {
    email: "henriquelemos10@msn.com",
    senha: "Hd100481",
    nome: "Henrique Lemos",
  },
];

function hmacSHA256Sync(message: string, secret: string): string {
  const { createHmac } = require("crypto");
  return createHmac("sha256", secret).update(message).digest("hex");
}

export function verifyCredentials(email: string, senha: string): { valid: boolean; nome?: string } {
  const admin = ADMINS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.senha === senha
  );
  if (!admin) return { valid: false };
  return { valid: true, nome: admin.nome };
}

export function createSessionToken(nome: string): { token: string; expires: Date } {
  const expires = new Date(Date.now() + SESSION_DURATION);
  const payload = `admin:${nome}:${expires.getTime()}`;
  const signature = hmacSHA256Sync(payload, ADMIN_SECRET);
  return {
    token: `${payload}:${signature}`,
    expires,
  };
}

export function verifySessionToken(token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 4) return false;
  const [role, nome, expiresStr, signature] = parts;
  const payload = `${role}:${nome}:${expiresStr}`;
  const expected = hmacSHA256Sync(payload, ADMIN_SECRET);
  if (signature !== expected) return false;
  if (Date.now() > Number(expiresStr)) return false;
  return true;
}

export function getSessionName(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 4) return null;
  return parts[1];
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session) return false;
  return verifySessionToken(session.value);
}

export { COOKIE_NAME };
