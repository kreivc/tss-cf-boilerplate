import { z } from "zod";

// =============================================================================
// PAYMENT PROVIDER TYPES
// =============================================================================

/**
 * Supported payment gateway providers
 */
export const PaymentProvider = z.enum(["IPAYMU"]);
export type PaymentProvider = z.infer<typeof PaymentProvider>;

/**
 * Payment gateway availability by country
 */
export const PaymentGatewayAvailability: Record<PaymentProvider, string[]> = {
  IPAYMU: ["id"], // Indonesia only
};

/**
 * Human-readable display names for payment providers
 */
export const PaymentProviderNames: Record<PaymentProvider, string> = {
  IPAYMU: "iPaymu",
};

// =============================================================================
// TRANSACTION STATUS
// =============================================================================

export const TransactionStatus = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);
export type TransactionStatus = z.infer<typeof TransactionStatus>;

// =============================================================================
// PAYMENT REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request payload for creating a payment
 */
export interface CreatePaymentRequest {
  /** Our internal transaction/reference ID */
  referenceId: string;
  /** Payment amount in the smallest currency unit or as decimal */
  amount: number;
  /** Currency symbol for display */
  currencySymbol: string;
  /** Product/item name for the payment */
  productName: string;
  /** Quantity of items */
  quantity: number;
  /** Buyer's name (optional) */
  buyerName?: string;
  /** Buyer's email for receipt (optional) */
  buyerEmail?: string;
  /** Buyer's phone number (optional) */
  buyerPhone?: string;
  /** URL to redirect after successful payment */
  returnUrl: string;
  /** URL to redirect if payment is cancelled */
  cancelUrl: string;
  /** Webhook URL for payment notifications/callbacks */
  notifyUrl: string;
}

/**
 * Response from creating a payment
 */
export interface CreatePaymentResponse {
  /** Whether the payment creation was successful */
  success: boolean;
  /** URL to redirect user to for payment (can be embedded in iframe) */
  paymentUrl: string;
  /** Payment provider's transaction/session ID */
  sessionId: string;
  /** Error message if success is false */
  errorMessage?: string;
}

// =============================================================================
// WEBHOOK TYPES
// =============================================================================

/**
 * Normalized webhook result - common interface for all payment gateways
 */
export interface NormalizedWebhookResult {
  /** Our internal reference ID (transaction ID) */
  referenceId: string;
  /** Whether the payment was successful */
  success: boolean;
  /** Mapped transaction status */
  status: TransactionStatus;
  /** Raw response string for logging/debugging */
  rawResponse: string;
  /** Provider's transaction/session ID */
  providerTransactionId: string;
  /** Provider-specific status code */
  providerStatusCode: string;
}

// =============================================================================
// GATEWAY CONFIGURATION
// =============================================================================

/**
 * Configuration for payment gateway initialization
 */
export interface GatewayConfig {
  baseUrl: string;
  apiKey: string;
  /** Virtual Account (for iPaymu) */
  va?: string;
  /** Webhook callback URL base */
  callbackUrl: string;
}
