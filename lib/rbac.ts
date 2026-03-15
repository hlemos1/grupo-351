import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifySessionToken, getSessionName, COOKIE_NAME } from "./auth";

export type AdminRole = "superadmin" | "admin" | "viewer";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  superadmin: 3,
  admin: 2,
  viewer: 1,
};

// Permissoes por acao
const ACTION_MIN_ROLE: Record<string, AdminRole> = {
  // Leitura — viewer pode ver tudo
  "read": "viewer",
  // Escrita — admin pode criar/editar
  "create": "admin",
  "update": "admin",
  // Deletar e acoes criticas — superadmin
  "delete": "superadmin",
  "manage-team": "superadmin",
  "export": "admin",
};

export function hasPermission(role: AdminRole, action: string): boolean {
  const minRole = ACTION_MIN_ROLE[action] || "admin";
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
}

export interface AdminSession {
  id: string;
  email: string;
  nome: string;
  role: AdminRole;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session) return null;

  if (!verifySessionToken(session.value)) return null;

  const nome = getSessionName(session.value);
  if (!nome) return null;

  // Buscar admin no banco para pegar role e id
  const admin = await prisma.adminUser.findFirst({
    where: { nome, ativo: true },
  });

  if (!admin) return null;

  return {
    id: admin.id,
    email: admin.email,
    nome: admin.nome,
    role: admin.role as AdminRole,
  };
}

export async function requireAdmin(minRole: AdminRole = "viewer"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("NOT_AUTHENTICATED");
  }
  if (!hasPermission(session.role, minRole === "superadmin" ? "manage-team" : minRole === "admin" ? "create" : "read")) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
