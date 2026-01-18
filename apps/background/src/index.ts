import { env } from "cloudflare:workers";
import { env as backgroundEnv } from "@test-tss/env/background";
import type {
  BaseQueueData,
  ReceivedWebhookData,
  SendEmailData,
} from "@test-tss/types";
import { processWebhook } from "./queue/process-webhook";
import { sendEmail } from "./queue/send-email";
import { expireTransaction } from "./schedule/expire-transaction";

if (backgroundEnv.IS_DEV === "true") {
  console.log(
    "Trigger Schedule Using:\n - http://localhost:3007/__scheduled?cron=* * * * *"
  );
  console.log(
    "Webhook Endpoint:\n - POST http://localhost:3007/api/webhook/payment"
  );
}

/**
 * Handle incoming HTTP requests (webhook callbacks)
 */
async function handleFetch(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Handle POST /api/webhook/payment
  if (request.method === "POST" && url.pathname === "/api/webhook/payment") {
    return await handlePaymentWebhook(request);
  }

  // Health check
  if (request.method === "GET" && url.pathname === "/health") {
    return Response.json({ status: "ok" });
  }

  return new Response("Not Found", { status: 404 });
}

/**
 * Handle payment webhook callback
 * Pushes the webhook data to the queue for processing
 */
async function handlePaymentWebhook(request: Request): Promise<Response> {
  try {
    // Get raw body
    const rawData = await request.text();

    // Determine provider from query param or default to ipaymu
    const url = new URL(request.url);
    const provider = url.searchParams.get("provider") ?? "ipaymu";

    console.log("[handlePaymentWebhook] Received webhook:", {
      provider,
      bodyLength: rawData.length,
    });

    // Create queue message
    const webhookData: ReceivedWebhookData = {
      provider,
      rawData,
      receivedAt: new Date().toISOString(),
    };

    // Push to queue for async processing
    await env.QUEUE.send({
      type: "receivedWebhook",
      data: webhookData,
    } satisfies BaseQueueData<ReceivedWebhookData>);

    console.log("[handlePaymentWebhook] Webhook queued for processing");

    // Return 200 OK immediately (important for webhooks)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "[handlePaymentWebhook] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Still return 200 to prevent webhook retries for our errors
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export default {
  // biome-ignore lint/suspicious/useAwait: CF Workers export pattern requires async
  async fetch(request: Request): Promise<Response> {
    return handleFetch(request);
  },

  async queue(batch: MessageBatch<BaseQueueData>) {
    for (const message of batch.messages) {
      try {
        const { type, data } = message.body;

        switch (type) {
          case "sendEmail":
            await sendEmail(data as SendEmailData);
            break;
          case "receivedWebhook":
            await processWebhook(data as ReceivedWebhookData);
            break;
          default:
            console.warn(`[queue] Unknown message type: ${type}`);
        }

        message.ack();
      } catch (e) {
        console.error("Failed to process message", message.id, e);
        // Don't ack failed messages - they'll be retried
      }
    }
  },

  scheduled(event: ScheduledEvent, _env: BackgroundEnv, ctx: ExecutionContext) {
    const cron = event.cron;
    console.log("Cron", cron);

    ctx.waitUntil(
      (async () => {
        switch (event.cron) {
          case "* * * * *":
          case "0 0 * * *":
          case "0 */6 * * *":
          case "0 12 * * MON":
            await expireTransaction();
            break;
          default:
            break;
        }
      })()
    );
  },
};
