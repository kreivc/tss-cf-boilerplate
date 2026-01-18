/**
 * iPaymu Webhook Handler Implementation
 *
 * Handles webhook callbacks from iPaymu payment gateway
 * Documentation: https://ipaymu.com/api
 */

import type { NormalizedWebhookResult } from "../../types";
import { WebhookHandler } from "../../webhook";
import { getStatusFromIpaymuCode, IpaymuWebhookDataSchema } from "./types";

/**
 * iPaymu Webhook Handler
 *
 * Parses and normalizes webhook callbacks from iPaymu.
 * Status codes:
 * - 1: berhasil (success)
 * - 0: pending
 * - -1: expired/failed
 * - -2: cancelled
 */
export class IpaymuWebhookHandler extends WebhookHandler {
  readonly name = "ipaymu";
  readonly displayName = "iPaymu";

  parseWebhook(rawData: string): NormalizedWebhookResult | null {
    try {
      const parsed = JSON.parse(rawData);
      const result = IpaymuWebhookDataSchema.safeParse(parsed);

      if (!result.success) {
        console.error(
          "[IpaymuWebhookHandler] Invalid webhook data:",
          result.error.message
        );
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
        providerStatusCode: data.status_code,
      };
    } catch (error) {
      console.error(
        "[IpaymuWebhookHandler] Failed to parse webhook:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    }
  }
}
