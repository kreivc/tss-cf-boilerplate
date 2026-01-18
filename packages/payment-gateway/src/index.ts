/**
 * Payment Gateway Package
 *
 * Centralized payment gateway logic with strategy pattern.
 * Supports multiple payment providers with automatic configuration from env.
 *
 * Usage:
 *   const gateway = getPaymentGateway("IPAYMU");
 *   const result = await gateway.createPayment({ ... });
 */

import { env } from "@test-tss/env/background";
import type { PaymentGateway } from "./abstract";
import { IpaymuGateway, IpaymuWebhookHandler } from "./providers/ipaymu";
import type { GatewayConfig, PaymentProvider } from "./types";
import type { WebhookHandler } from "./webhook";

export * from "./abstract";
export * from "./providers/ipaymu";
export * from "./types";
export * from "./webhook";

// =============================================================================
// INTERNAL CONFIGURATION
// =============================================================================

/**
 * Get the configuration for a payment provider from environment variables.
 * This is internal - consumers should use getPaymentGateway() instead.
 */
function getConfigForProvider(provider: PaymentProvider): GatewayConfig {
  switch (provider) {
    case "IPAYMU":
      return {
        baseUrl: env.IPAYMU_BASE_URL ?? "",
        apiKey: env.IPAYMU_API_KEY ?? "",
        va: env.IPAYMU_VA ?? "",
        callbackUrl: env.IPAYMU_CALLBACK_URL ?? "",
      };
    default:
      throw new Error(`No configuration found for provider: ${provider}`);
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Get a configured payment gateway instance for a provider.
 *
 * @param provider - Payment provider identifier ("IPAYMU", etc.)
 * @returns Configured payment gateway instance
 * @throws Error if provider is not supported
 *
 * @example
 * const gateway = getPaymentGateway("IPAYMU");
 * const result = await gateway.createPayment({
 *   referenceId: "ORDER-123",
 *   amount: 50000,
 *   // ...
 * });
 */
export function getPaymentGateway(provider: PaymentProvider): PaymentGateway {
  const config = getConfigForProvider(provider);

  switch (provider) {
    case "IPAYMU":
      return new IpaymuGateway(config);
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

/**
 * Get the callback URL for a payment provider.
 * Useful for constructing webhook URLs.
 *
 * @param provider - Payment provider identifier
 * @returns The callback URL base
 */
export function getCallbackUrl(provider: PaymentProvider): string {
  const config = getConfigForProvider(provider);
  return config.callbackUrl;
}

/**
 * Get a webhook handler for a specific provider.
 *
 * @param provider - Provider identifier string
 * @returns Webhook handler instance
 * @throws Error if provider is not supported
 */
export function getWebhookHandler(provider: string): WebhookHandler {
  switch (provider.toLowerCase()) {
    case "ipaymu":
      return new IpaymuWebhookHandler();
    default:
      throw new Error(`Unsupported webhook provider: ${provider}`);
  }
}

/**
 * List of supported payment providers
 */
export const SUPPORTED_PAYMENT_PROVIDERS = ["IPAYMU"] as const;

/**
 * List of supported webhook providers
 */
export const SUPPORTED_WEBHOOK_PROVIDERS = ["ipaymu"] as const;

/**
 * @deprecated Use getPaymentGateway() instead
 */
export function createPaymentGateway(
  provider: PaymentProvider,
  config: GatewayConfig
): PaymentGateway {
  switch (provider) {
    case "IPAYMU":
      return new IpaymuGateway(config);
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
