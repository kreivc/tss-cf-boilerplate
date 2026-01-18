/**
 * Webhook Handler Abstract Class
 *
 * Base class for all webhook handler implementations.
 * Handles parsing and validation of incoming webhook callbacks.
 */

import type { NormalizedWebhookResult } from "./types";

/**
 * Abstract base class for webhook handler implementations
 *
 * To add a new payment provider webhook handler:
 * 1. Create a new class extending WebhookHandler
 * 2. Implement the parseWebhook method
 * 3. Optionally implement validateSignature for security
 * 4. Register it in the webhook handler factory
 */
export abstract class WebhookHandler {
  /** Unique identifier for this webhook handler (matches payment gateway name) */
  abstract readonly name: string;

  /** Human-readable display name */
  abstract readonly displayName: string;

  /**
   * Parse raw webhook data into normalized result
   *
   * @param rawData - Raw JSON string from webhook payload
   * @returns Normalized webhook result or null if parsing fails
   */
  abstract parseWebhook(rawData: string): NormalizedWebhookResult | null;

  /**
   * Validate webhook signature/authenticity (optional)
   * Override this method if the payment gateway provides signature validation
   *
   * @param headers - Request headers from webhook
   * @param body - Raw request body
   * @returns true if signature is valid, false otherwise
   */
  validateSignature?(
    headers: Record<string, string>,
    body: string
  ): Promise<boolean>;
}
