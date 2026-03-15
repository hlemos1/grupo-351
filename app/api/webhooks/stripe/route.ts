import { handleWebhookEvent } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    await handleWebhookEvent(body, signature);
    return new Response("OK", { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook error:", msg);
    return new Response(msg, { status: 400 });
  }
}
