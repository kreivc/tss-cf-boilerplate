/**
 * Queue Types for Background Worker
 *
 * These types are internal to the background worker and define
 * the structure of messages processed through Cloudflare Queues.
 */

// =============================================================================
// QUEUE MESSAGE TYPES
// =============================================================================

export type QueueType = "sendEmail" | "receivedWebhook";

export interface BaseQueueData<T = unknown> {
  type: QueueType;
  data: T;
}

// =============================================================================
// WEBHOOK DATA
// =============================================================================

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

// =============================================================================
// EMAIL DATA
// =============================================================================

/**
 * Queue data for sending emails
 */
export interface SendEmailData {
  /** Recipient name */
  name: string;
  /** Recipient email address */
  email: string;
  /** Email subject line */
  subject: string;
  /** Plain text email content (fallback) */
  text: string;
  /** Optional transaction details for rich email template */
  transactionDetails?: {
    transactionId: string;
    gameName: string;
    itemName: string;
    amount: number;
    date: string;
  };
}
