import { z } from "zod";

export const PaymentProvider = z.enum(["MIDTRANS"]);
export type PaymentProvider = z.infer<typeof PaymentProvider>;

export const TransactionStatus = z.enum([
  "PENDING",
  "PAID",
  "SUCCESS",
  "FAILED",
]);
export type TransactionStatus = z.infer<typeof TransactionStatus>;
