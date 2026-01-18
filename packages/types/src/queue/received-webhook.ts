/**
 * Queue data for received webhook callbacks from payment gateways
 */
export interface ReceivedWebhookData {
  /** Payment gateway provider identifier (e.g., "ipaymu") */
  provider: string;
  /** Raw JSON string from webhook payload */
  rawData: string;
  /** ISO timestamp when webhook was received */
  receivedAt: string;
}
