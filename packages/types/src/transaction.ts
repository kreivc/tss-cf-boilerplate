import { z } from "zod";

// =============================================================================
// TRANSACTION INPUT SCHEMAS (API layer)
// =============================================================================

/**
 * Input schema for creating a transaction
 */
export const CreateTransactionInput = z.object({
  gameId: z.string(),
  itemId: z.string(),
  itemDetailId: z.string(),
  email: z.string().email(),
  /** Game-specific parameters (userId, serverId, uid, etc.) */
  gameParams: z.record(z.string(), z.string()),
  /** Payment provider identifier (e.g., "IPAYMU") */
  paymentMethod: z.string(),
});
export type CreateTransactionInput = z.infer<typeof CreateTransactionInput>;

/**
 * Input schema for getting a transaction
 */
export const GetTransactionInput = z.object({
  transactionId: z.string(),
});
export type GetTransactionInput = z.infer<typeof GetTransactionInput>;

/**
 * Re-export TransactionStatus from payment-gateway for convenience
 * Note: Using /client path to avoid cloudflare:workers dependency
 */
export { TransactionStatus } from "@test-tss/payment-gateway/client";

/**
 * Input schema for updating transaction status
 */
export const UpdateTransactionStatusInput = z.object({
  transactionId: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SUCCESS", "FAILED"]),
});
export type UpdateTransactionStatusInput = z.infer<
  typeof UpdateTransactionStatusInput
>;
