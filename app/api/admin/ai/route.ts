import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/ai-context";
import { aiMessagesSchema } from "@/lib/validations";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const rl = rateLimit(`ai:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return new Response(
      JSON.stringify({ error: "Limite de requisições atingido. Aguarde 1 minuto." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GOOGLE_API_KEY não configurada nas variáveis de ambiente" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const parsed = aiMessagesSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Dados inválidos", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = parsed.data;
  const systemPrompt = await buildSystemPrompt();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  // Convert messages to Gemini format (history + last user message)
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;

  const chat = model.startChat({ history });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(lastMessage);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
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
