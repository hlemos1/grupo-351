/**
 * Notification system — sends alerts when new leads arrive.
 *
 * Supports:
 * - Console logging (always)
 * - Webhook (Slack, Discord, Make, Zapier) via NOTIFY_WEBHOOK_URL
 * - Email via future integration
 *
 * Configure via .env.local:
 *   NOTIFY_WEBHOOK_URL=https://hooks.slack.com/services/xxx
 */

interface NotifyPayload {
  tipo: "candidatura" | "contato";
  nome: string;
  email: string;
  resumo: string;
}

export async function notify(payload: NotifyPayload) {
  const timestamp = new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" });

  // Always log to console
  console.log(`\n📬 NOVA ${payload.tipo.toUpperCase()} — ${timestamp}`);
  console.log(`   Nome: ${payload.nome}`);
  console.log(`   Email: ${payload.email}`);
  console.log(`   ${payload.resumo}`);
  console.log(`   → Admin: /admin/${payload.tipo === "candidatura" ? "candidaturas" : "contatos"}\n`);

  // Webhook (Slack, Discord, Make, Zapier, etc.)
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const emoji = payload.tipo === "candidatura" ? "🚀" : "💬";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${emoji} *Nova ${payload.tipo}* — ${payload.nome} (${payload.email})\n${payload.resumo}`,
          // Slack-compatible format
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${emoji} *Nova ${payload.tipo}*\n*Nome:* ${payload.nome}\n*Email:* ${payload.email}\n${payload.resumo}`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `_${timestamp} — Grupo +351 Admin_`,
                },
              ],
            },
          ],
        }),
      });
    } catch (err) {
      console.error("Webhook notification failed:", err);
    }
  }
}
