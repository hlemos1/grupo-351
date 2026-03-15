import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — SSE stream para novas mensagens de um match
export async function GET(request: Request) {
  const session = await getUserSession();
  if (!session) {
    return new Response("Não autorizado", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return new Response("matchId obrigatório", { status: 400 });
  }

  // Verificar participação
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || (match.fromUserId !== session.id && match.toUserId !== session.id)) {
    return new Response("Sem permissão", { status: 403 });
  }

  const encoder = new TextEncoder();
  let lastChecked = new Date();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial ping
      controller.enqueue(encoder.encode("event: connected\ndata: {}\n\n"));

      // Poll for new messages every 2 seconds
      const interval = setInterval(async () => {
        if (closed) {
          clearInterval(interval);
          return;
        }

        try {
          const newMessages = await prisma.message.findMany({
            where: {
              matchId,
              criadoEm: { gt: lastChecked },
            },
            include: {
              user: { select: { id: true, nome: true } },
            },
            orderBy: { criadoEm: "asc" },
          });

          if (newMessages.length > 0) {
            lastChecked = newMessages[newMessages.length - 1].criadoEm;
            for (const msg of newMessages) {
              const data = JSON.stringify({
                id: msg.id,
                conteudo: msg.conteudo,
                criadoEm: msg.criadoEm.toISOString(),
                userId: msg.userId,
                user: msg.user,
              });
              controller.enqueue(encoder.encode(`event: message\ndata: ${data}\n\n`));
            }
          }

          // Keep-alive ping every cycle
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // Connection likely closed
          closed = true;
          clearInterval(interval);
        }
      }, 2000);

      // Timeout after 5 minutes to avoid long-running connections
      setTimeout(() => {
        closed = true;
        clearInterval(interval);
        try { controller.close(); } catch {}
      }, 5 * 60 * 1000);
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
