import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/ai-context";

const client = new Anthropic();

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY não configurada no .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await request.json();
  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Messages obrigatórias" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildSystemPrompt();

  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
