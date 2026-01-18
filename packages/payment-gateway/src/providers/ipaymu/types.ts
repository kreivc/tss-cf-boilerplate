import { z } from "zod";
import type { TransactionStatus } from "../../types";

// =============================================================================
// IPAYMU WEBHOOK DATA
// =============================================================================

/**
 * iPaymu webhook callback data structure
 * Documentation: https://ipaymu.com/api
 */
export const IpaymuWebhookDataSchema = z.object({
  trx_id: z.string(),
  status: z.string(),
  status_code: z.string(),
  sid: z.string(),
  reference_id: z.string(),
});
export type IpaymuWebhookData = z.infer<typeof IpaymuWebhookDataSchema>;

/**
 * iPaymu API response structure
 */
export interface IpaymuApiResponse {
  Status: number;
  Message: string;
  Data?: {
    SessionId: string;
    Url: string;
  };
}

// =============================================================================
// STATUS MAPPING
// =============================================================================

/**
 * iPaymu status code to TransactionStatus mapping
 * Based on iPaymu documentation:
 * - 1: berhasil (success)
 * - 0: pending
 * - -1: expired/failed
 * - -2: cancelled
 */
export const IPAYMU_STATUS_MAP: Record<string, TransactionStatus> = {
  "1": "SUCCESS",
  "0": "PENDING",
  "-1": "FAILED",
  "-2": "FAILED",
};

/**
 * Get TransactionStatus from iPaymu status code
 */
export function getStatusFromIpaymuCode(statusCode: string): TransactionStatus {
  return IPAYMU_STATUS_MAP[statusCode] ?? "FAILED";
}
