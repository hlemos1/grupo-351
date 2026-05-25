/**
 * Autenticação por API key para a API pública v1.
 *
 * Header: Authorization: Bearer pk351_xxx
 *
 * Scopes: companies:read, opportunities:read, opportunities:write, matches:read
 */

import { prisma } from "./prisma";
import { logger } from "./logger";
import crypto from "crypto";

export interface ApiKeyContext {
  userId: string;
  keyId: string;
  scopes: string[];
}

export async function validateApiKey(request: Request): Promise<ApiKeyContext | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const key = auth.slice(7);
  if (!key.startsWith("pk351_")) return null;

  // Nunca buscar pela key crua: armazenamos apenas o hash sha256.
  const apiKey = await prisma.apiKey.findUnique({ where: { keyHash: hashApiKey(key) } });
  if (!apiKey || !apiKey.ativa) return null;

  // Atualizar último uso (fire-and-forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { ultimoUso: new Date() },
    })
    .catch((err) =>
      logger.warn("Failed to update API key ultimoUso", "api-auth", { error: String(err) })
    );

  return {
    userId: apiKey.userId,
    keyId: apiKey.id,
    scopes: apiKey.scopes,
  };
}

export function hasScope(ctx: ApiKeyContext, scope: string): boolean {
  return ctx.scopes.includes(scope) || ctx.scopes.includes("*");
}

export function generateApiKey(): string {
  // 24 bytes aleatorios = 192 bits de entropia -> sha256 e' adequado (lookup indexado).
  return `pk351_${crypto.randomBytes(24).toString("hex")}`;
}

/** Hash determinístico (sha256) usado como chave de busca da API key. */
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

/** Partes exibíveis da key (a key completa nunca é recuperável após criação). */
export function apiKeyDisplayParts(key: string): { keyPrefix: string; keyLast4: string } {
  return { keyPrefix: key.slice(0, 12), keyLast4: key.slice(-4) };
}
