/**
 * Payment Gateway Abstract Class
 *
 * Base class for all payment gateway implementations.
 * New payment providers implement this class.
 */

import type { CreatePaymentRequest, CreatePaymentResponse } from "./types";

/**
 * Abstract base class for payment gateway implementations
 *
 * To add a new payment provider:
 * 1. Create a new class extending PaymentGateway
 * 2. Implement the createPayment method
 * 3. Register it in the payment gateway factory (index.ts)
 */
export abstract class PaymentGateway {
  /** Unique identifier for this payment gateway */
  abstract readonly name: string;

  /** Human-readable display name */
  abstract readonly displayName: string;

  /**
   * Get a random seed value to add to the transaction amount.
   * This helps with payment verification and unique amount identification.
   *
   * @returns A random seed value (provider-specific range)
   */
  abstract getSeed(): number;

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
