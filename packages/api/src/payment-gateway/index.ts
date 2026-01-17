/**
 * Payment Gateway Module
 *
 * This module exports all payment gateway types, implementations, and factory functions.
 */

export * from "./abstract";
export * from "./ipaymu";

import { env } from "cloudflare:workers";
import type { PaymentGateway } from "./abstract";
import { IpaymuGateway } from "./ipaymu";

/**
 * Create a payment gateway instance based on the configured environment
 *
 * Currently defaults to iPaymu. In the future, this can be extended to
 * support multiple providers based on configuration or payment method selection.
 *
 * @returns Configured payment gateway instance
 */
export function createPaymentGateway(): PaymentGateway {
  return new IpaymuGateway(
    env.IPAYMU_BASE_URL,
    env.IPAYMU_API_KEY,
    env.IPAYMU_VA
  );
}

/**
 * Get a specific payment gateway by name
 *
 * @param name - Gateway identifier (e.g., "ipaymu")
 * @returns Payment gateway instance or null if not found
 */
export function getPaymentGateway(name: string): PaymentGateway | null {
  switch (name.toLowerCase()) {
    case "ipaymu":
      return new IpaymuGateway(
        env.IPAYMU_BASE_URL,
        env.IPAYMU_API_KEY,
        env.IPAYMU_VA
      );
    default:
      return null;
  }
}
