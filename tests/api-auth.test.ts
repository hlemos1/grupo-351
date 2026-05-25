import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  hasScope,
  generateApiKey,
  hashApiKey,
  apiKeyDisplayParts,
  validateApiKey,
  type ApiKeyContext,
} from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

describe("hasScope", () => {
  it("returns true when scope matches", () => {
    const ctx: ApiKeyContext = {
      userId: "u1",
      keyId: "k1",
      scopes: ["companies:read", "opportunities:read"],
    };
    expect(hasScope(ctx, "companies:read")).toBe(true);
  });

  it("returns false when scope does not match", () => {
    const ctx: ApiKeyContext = { userId: "u1", keyId: "k1", scopes: ["companies:read"] };
    expect(hasScope(ctx, "opportunities:write")).toBe(false);
  });

  it("returns true for wildcard scope", () => {
    const ctx: ApiKeyContext = { userId: "u1", keyId: "k1", scopes: ["*"] };
    expect(hasScope(ctx, "anything")).toBe(true);
  });

  it("returns false for empty scopes", () => {
    const ctx: ApiKeyContext = { userId: "u1", keyId: "k1", scopes: [] };
    expect(hasScope(ctx, "companies:read")).toBe(false);
  });
});

describe("generateApiKey", () => {
  it("starts with pk351_ prefix", () => {
    const key = generateApiKey();
    expect(key.startsWith("pk351_")).toBe(true);
  });

  it("has sufficient length", () => {
    const key = generateApiKey();
    // pk351_ + 48 hex chars (24 bytes)
    expect(key.length).toBe(6 + 48);
  });

  it("generates unique keys", () => {
    const keys = new Set(Array.from({ length: 10 }, () => generateApiKey()));
    expect(keys.size).toBe(10);
  });
});

describe("hashApiKey", () => {
  it("e' deterministico (sha256 hex, 64 chars)", () => {
    const k = "pk351_" + "a".repeat(48);
    const h1 = hashApiKey(k);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
    expect(hashApiKey(k)).toBe(h1);
  });

  it("keys diferentes geram hashes diferentes", () => {
    expect(hashApiKey("pk351_aaa")).not.toBe(hashApiKey("pk351_bbb"));
  });
});

describe("apiKeyDisplayParts", () => {
  it("extrai prefixo (12) e ultimos 4", () => {
    const k = "pk351_0123456789abcdefXYZW";
    expect(apiKeyDisplayParts(k)).toEqual({ keyPrefix: "pk351_012345", keyLast4: "XYZW" });
  });
});

describe("validateApiKey (C-1: busca por hash, nunca pela key crua)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("consulta por keyHash sha256 e nunca expoe a key crua na query", async () => {
    const rawKey = "pk351_" + "a".repeat(48);
    (prisma.apiKey.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "k1",
      userId: "u1",
      scopes: ["companies:read"],
      ativa: true,
    });
    (prisma.apiKey.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const req = new Request("https://grupo351.com/api/v1/companies", {
      headers: { Authorization: "Bearer " + rawKey },
    });
    const ctx = await validateApiKey(req);

    expect(ctx).not.toBeNull();
    expect(ctx!.userId).toBe("u1");
    const callArg = (prisma.apiKey.findUnique as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg).toEqual({ where: { keyHash: hashApiKey(rawKey) } });
    // a key crua NUNCA pode aparecer na query ao banco
    expect(JSON.stringify(callArg)).not.toContain(rawKey);
  });

  it("rejeita quando nao acha o hash", async () => {
    (prisma.apiKey.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const req = new Request("https://grupo351.com/api/v1/companies", {
      headers: { Authorization: "Bearer pk351_" + "b".repeat(48) },
    });
    expect(await validateApiKey(req)).toBeNull();
  });
});
