import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — listar notificacoes do user + unread count
export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [notifications, unreadCount] = await Promise.all([
    prisma.userNotification.findMany({
      where: { userId: session.id },
      orderBy: { criadoEm: "desc" },
      take: 20,
    }),
    prisma.userNotification.count({ where: { userId: session.id, lida: false } }),
  ]);

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      tipo: n.tipo,
      titulo: n.titulo,
      mensagem: n.mensagem,
      link: n.link,
      lida: n.lida,
      criadoEm: n.criadoEm.toISOString(),
    })),
    unreadCount,
  });
}

// PATCH — marcar como lida (individual ou todas)
export async function PATCH(request: Request) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (body.markAllRead) {
    await prisma.userNotification.updateMany({
      where: { userId: session.id, lida: false },
      data: { lida: true },
    });
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    await prisma.userNotification.updateMany({
      where: { id: body.id, userId: session.id },
      data: { lida: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
