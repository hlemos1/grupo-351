import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUserNotification } from "@/lib/user-notifications";
import { sendMessageReceivedEmail } from "@/lib/email";

// GET — mensagens de um match
export async function GET(request: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId obrigatório" }, { status: 400 });
  }

  // Verificar que o usuário participa do match
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || (match.fromUserId !== session.id && match.toUserId !== session.id)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    include: {
      user: { select: { id: true, nome: true } },
    },
    orderBy: { criadoEm: "asc" },
    take: 100,
  });

  return NextResponse.json(messages);
}

// POST — enviar mensagem
export async function POST(request: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const { matchId, conteudo } = body;

  if (!matchId || !conteudo?.trim()) {
    return NextResponse.json({ error: "matchId e conteudo obrigatórios" }, { status: 400 });
  }

  // Verificar participação e status
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || (match.fromUserId !== session.id && match.toUserId !== session.id)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  // Só pode enviar mensagens em matches aceitos ou em conversa
  if (!["aceito", "em-conversa"].includes(match.status)) {
    return NextResponse.json({ error: "Mensagens só podem ser enviadas em matches aceitos" }, { status: 403 });
  }

  // Se status é "aceito", mudar para "em-conversa"
  if (match.status === "aceito") {
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "em-conversa" },
    });
  }

  const message = await prisma.message.create({
    data: {
      conteudo: conteudo.trim().slice(0, 5000),
      userId: session.id,
      matchId,
    },
    include: {
      user: { select: { id: true, nome: true } },
    },
  });

  // Notificar o outro participante (fire-and-forget)
  const recipientId = match.fromUserId === session.id ? match.toUserId : match.fromUserId;
  const recipient = await prisma.user.findUnique({ where: { id: recipientId }, select: { nome: true, email: true } });

  if (recipient) {
    createUserNotification({
      userId: recipientId,
      tipo: "message",
      titulo: `Nova mensagem de ${session.nome}`,
      mensagem: conteudo.trim().slice(0, 100),
      link: `/dashboard/matches`,
    });
    sendMessageReceivedEmail({
      nome: recipient.nome,
      email: recipient.email,
      remetente: session.nome,
      preview: conteudo.trim(),
      matchId,
    });
  }

  return NextResponse.json(message, { status: 201 });
}
