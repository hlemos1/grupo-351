import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, hasPermission } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const admins = await prisma.adminUser.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true,
      email: true,
      nome: true,
      role: true,
      ativo: true,
      ultimoLogin: true,
      criadoEm: true,
    },
  });

  return NextResponse.json(admins.map((a) => ({
    ...a,
    ultimoLogin: a.ultimoLogin?.toISOString() || null,
    criadoEm: a.criadoEm.toISOString(),
  })));
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(admin.role, "manage-team")) {
    return NextResponse.json({ error: "Apenas superadmin pode gerir a equipe" }, { status: 403 });
  }

  const body = await req.json();
  const { email, nome, senha, role } = body;

  if (!email || !nome || !senha) {
    return NextResponse.json({ error: "Email, nome e senha são obrigatórios" }, { status: 400 });
  }

  const validRoles = ["admin", "viewer"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: "Role inválido" }, { status: 400 });
  }

  const exists = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) {
    return NextResponse.json({ error: "Email já registrado" }, { status: 409 });
  }

  const senhaHash = await bcrypt.hash(senha, 12);
  const newAdmin = await prisma.adminUser.create({
    data: {
      email: email.toLowerCase(),
      nome,
      senhaHash,
      role: role || "admin",
    },
    select: { id: true, email: true, nome: true, role: true },
  });

  await logAudit({
    acao: "create",
    recurso: "admin",
    resourceId: newAdmin.id,
    adminId: admin.id,
    adminNome: admin.nome,
    detalhes: { email: newAdmin.email, role: newAdmin.role },
  });

  return NextResponse.json(newAdmin, { status: 201 });
}
