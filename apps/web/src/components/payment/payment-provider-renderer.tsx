import { CreditCardIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Payment provider types that can be used in the system
 */
export type PaymentProviderType = "ipaymu" | "default";

export interface PaymentProviderRenderProps {
  paymentUrl: string;
  referenceId: string;
}

/**
 * Registry of payment provider renderers
 * Add new providers here when integrating new payment gateways
 */
const paymentProviders: Record<
  PaymentProviderType,
  (props: PaymentProviderRenderProps) => ReactNode
> = {
  /**
   * iPaymu payment provider renderer
   * Opens payment page in new tab (iframe not supported due to X-Frame-Options)
   */
  ipaymu: ({ paymentUrl, referenceId }) => (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-gaming-primary/20 bg-gradient-to-br from-gaming-primary/5 to-gaming-secondary/5 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-gaming-primary/20">
          <CreditCardIcon className="size-8 text-gaming-primary" />
        </div>
        <div className="text-center">
          <p className="mb-2 font-semibold text-lg">Ready to Pay</p>
          <p className="text-muted-foreground text-sm">
            You'll be redirected to iPaymu to complete your payment securely.
          </p>
        </div>
        <a
          className="btn-gaming inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-semibold text-white transition-all hover:scale-105"
          href={paymentUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <CreditCardIcon className="size-5" />
          Pay Now
        </a>
      </div>
      <p className="mb-2 font-mono text-muted-foreground text-sm">
        Reference: {referenceId}
      </p>
      <p className="text-center text-muted-foreground text-xs">
        After completing payment, return here and refresh to see your order
        status.
      </p>
    </div>
  ),

  /**
   * Default/fallback payment provider renderer
   * Used when provider is unknown or not configured
   */
  default: ({ paymentUrl, referenceId }) => (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-4 rounded-xl border border-gray-500/20 bg-gradient-to-br from-gray-500/5 to-gray-600/5 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-gray-500/20">
          <CreditCardIcon className="size-8 text-gray-500" />
        </div>
        <div className="text-center">
          <p className="mb-2 font-semibold text-lg">Complete Payment</p>
          <p className="text-muted-foreground text-sm">
            Click below to complete your payment.
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-600 px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-gray-700"
          href={paymentUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <CreditCardIcon className="size-5" />
          Pay Now
        </a>
      </div>
      <p className="mb-2 font-mono text-muted-foreground text-sm">
        Reference: {referenceId}
      </p>
      <p className="text-center text-muted-foreground text-xs">
        After completing payment, return here and refresh to see your order
        status.
      </p>
    </div>
  ),
};

/**
 * Get the appropriate renderer for a payment provider
 * Falls back to default renderer if provider is not found
 */
export function getPaymentProviderRenderer(
  provider: string
): (props: PaymentProviderRenderProps) => ReactNode {
  const normalizedProvider = provider.toLowerCase() as PaymentProviderType;
  return paymentProviders[normalizedProvider] ?? paymentProviders.default;
}

/**
 * PaymentProviderRenderer component
 * Renders the appropriate payment UI based on the provider
 */
export function PaymentProviderRenderer({
  provider,
  paymentUrl,
  referenceId,
}: {
  provider: string;
  paymentUrl: string;
  referenceId: string;
}) {
  const renderer = getPaymentProviderRenderer(provider);
  return renderer({ paymentUrl, referenceId });
}
