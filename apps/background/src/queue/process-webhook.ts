/**
 * Webhook Queue Handler
 *
 * Processes webhook callbacks from payment gateways.
 * Uses clean factory functions from @test-tss/payment-gateway and @test-tss/game-provider.
 */

import { env } from "cloudflare:workers";
import { db } from "@test-tss/db";
import { games } from "@test-tss/db/schema/game";
import { items } from "@test-tss/db/schema/item";
import { itemDetails } from "@test-tss/db/schema/item-detail";
import { transactions } from "@test-tss/db/schema/transaction";
import {
  type GameSlug,
  getGameProvider,
  isGameSupported,
  parseGameParams,
} from "@test-tss/game-provider";
import {
  getStatusFromIpaymuCode,
  IpaymuWebhookDataSchema,
  type TransactionStatus,
} from "@test-tss/payment-gateway";
import type { ReceivedWebhookData, SendEmailData } from "@test-tss/types";
import { eq } from "drizzle-orm";

/**
 * Parse iPaymu webhook data directly
 */
function parseIpaymuWebhook(rawData: string): {
  referenceId: string;
  success: boolean;
  status: TransactionStatus;
  rawResponse: string;
  providerTransactionId: string;
} | null {
  try {
    const parsed = JSON.parse(rawData);
    const result = IpaymuWebhookDataSchema.safeParse(parsed);

    if (!result.success) {
      console.error("[parseIpaymuWebhook] Invalid data:", result.error.message);
      return null;
    }

    const data = result.data;
    const status = getStatusFromIpaymuCode(data.status_code);

    return {
      referenceId: data.reference_id,
      success: status === "SUCCESS",
      status,
      rawResponse: rawData,
      providerTransactionId: data.trx_id,
    };
  } catch (error) {
    console.error(
      "[parseIpaymuWebhook] Parse error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return null;
  }
}

/**
 * Process a webhook callback from a payment gateway
 */
export async function processWebhook(data: ReceivedWebhookData): Promise<void> {
  console.log("[processWebhook] Processing:", {
    provider: data.provider,
    receivedAt: data.receivedAt,
  });

  // Parse webhook based on provider
  let webhookResult: ReturnType<typeof parseIpaymuWebhook>;
  switch (data.provider.toLowerCase()) {
    case "ipaymu":
      webhookResult = parseIpaymuWebhook(data.rawData);
      break;
    default:
      console.error(`[processWebhook] Unknown provider: ${data.provider}`);
      return;
  }

  if (!webhookResult) {
    console.error("[processWebhook] Failed to parse webhook");
    return;
  }

  console.log("[processWebhook] Parsed:", {
    referenceId: webhookResult.referenceId,
    status: webhookResult.status,
    success: webhookResult.success,
  });

  // Find transaction by referenceId
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.referenceId, webhookResult.referenceId))
    .limit(1);

  if (!transaction) {
    console.error(
      `[processWebhook] Transaction not found: ${webhookResult.referenceId}`
    );
    return;
  }

  console.log("[processWebhook] Found transaction:", {
    id: transaction.id,
    currentStatus: transaction.status,
    newStatus: webhookResult.status,
  });

  // Update transaction status
  const now = new Date().toISOString();
  await db
    .update(transactions)
    .set({
      status: webhookResult.status,
      responseString: webhookResult.rawResponse,
      updatedAt: now,
      updatedBy: "webhook",
    })
    .where(eq(transactions.id, transaction.id));

  console.log("[processWebhook] Updated status to:", webhookResult.status);

  // Get game and item details
  const [game, item, _itemDetail] = await Promise.all([
    db.select().from(games).where(eq(games.id, transaction.gameId)).limit(1),
    db.select().from(items).where(eq(items.id, transaction.itemId)).limit(1),
    db
      .select()
      .from(itemDetails)
      .where(eq(itemDetails.id, transaction.itemDetailId))
      .limit(1),
  ]);

  // Parse game params
  const gameParams = parseGameParams(transaction.inputData);
  const gameSlug = transaction.gameSlug;

  // Process top-up if payment successful
  if (webhookResult.success && isGameSupported(gameSlug)) {
    const gameProvider = getGameProvider(gameSlug as GameSlug);

    console.log(
      `[processWebhook] Sending top-up via ${gameProvider.displayName}`
    );

    const topUpResult = await gameProvider.sendTopUp({
      gameSlug: gameSlug as GameSlug,
      gameParams: gameParams ?? {},
      itemCode: item[0]?.slug ?? "",
      transactionId: transaction.id,
    });

    console.log("[processWebhook] Top-up result:", {
      success: topUpResult.success,
      message: topUpResult.message,
      providerTxId: topUpResult.providerTransactionId,
    });

    // Update transaction with top-up result if needed
    if (!topUpResult.success) {
      await db
        .update(transactions)
        .set({
          status: "FAILED",
          updatedAt: new Date().toISOString(),
          updatedBy: "topup-failed",
        })
        .where(eq(transactions.id, transaction.id));
    }
  } else if (!isGameSupported(gameSlug)) {
    console.warn(`[processWebhook] Game not supported: ${gameSlug}`);
  }

  // Send email if successful and email exists
  if (
    webhookResult.success &&
    transaction.email &&
    isValidEmail(transaction.email)
  ) {
    const emailData: SendEmailData = {
      name: "Customer",
      email: transaction.email,
      subject: `Top-up Successful - ${game[0]?.name ?? "Game"}`,
      text: `Your top-up for ${item[0]?.name ?? "item"} completed.\n\nTransaction: ${transaction.id}\nAmount: ${transaction.totalPrice}`,
    };

    await env.QUEUE.send({ type: "sendEmail", data: emailData });
    console.log("[processWebhook] Email queued:", transaction.email);
  }
}

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".") && email.length > 5;
}
