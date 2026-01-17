/**
 * Payment Gateway Abstraction Layer
 *
 * This module provides abstract interfaces and types for payment gateway integrations.
 * New payment providers can be added by implementing the PaymentGateway abstract class.
 */

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

/**
 * Abstract base class for payment gateway implementations
 *
 * To add a new payment provider:
 * 1. Create a new class extending PaymentGateway
 * 2. Implement the createPayment method
 * 3. Register it in the payment gateway factory
 */
export abstract class PaymentGateway {
  /** Unique identifier for this payment gateway */
  abstract readonly name: string;

  /** Human-readable display name */
  abstract readonly displayName: string;

  /**
   * Create a new payment session with the payment provider
   *
   * @param request - Payment details including amount, product, and URLs
   * @returns Payment URL and session information
   */
  abstract createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse>;
}
