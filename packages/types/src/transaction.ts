import { z } from "zod";

/**
 * Payment providers/gateways available in the system
 */
export const PaymentProvider = z.enum(["IPAYMU"]);
export type PaymentProvider = z.infer<typeof PaymentProvider>;

/**
 * Mapping of payment providers to their available locales/countries
 * Key: PaymentProvider value
 * Value: Array of locale codes where the provider is available
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

export const TransactionStatus = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
]);
export type TransactionStatus = z.infer<typeof TransactionStatus>;

// Input schemas for transaction API
export const CreateTransactionInput = z.object({
  gameId: z.string(),
  itemId: z.string(),
  itemDetailId: z.string(),
  email: z.string().email(),
  /** Game-specific parameters (userId, serverId, uid, etc.) */
  gameParams: z.record(z.string(), z.string()),
  paymentMethod: z.string(),
});
export type CreateTransactionInput = z.infer<typeof CreateTransactionInput>;

export const GetTransactionInput = z.object({
  transactionId: z.string(),
});
export type GetTransactionInput = z.infer<typeof GetTransactionInput>;

export const UpdateTransactionStatusInput = z.object({
  transactionId: z.string(),
  status: TransactionStatus,
});
export type UpdateTransactionStatusInput = z.infer<
  typeof UpdateTransactionStatusInput
>;
