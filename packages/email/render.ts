// @ts-nocheck
/**
 * Email Render Functions
 *
 * Pre-compiled render functions for email templates.
 * Uses @ts-nocheck to avoid JSX runtime conflicts when this module
 * is imported by projects with different JSX configurations.
 */

import { render } from "@react-email/components";
import { TransactionSuccessEmail } from "./emails/transaction-success";

export interface TransactionEmailProps {
  customerName?: string;
  transactionId?: string;
  gameName?: string;
  itemName?: string;
  amount?: number;
  date?: string;
}

/**
 * Render transaction success email to HTML string
 */
export async function renderTransactionSuccessEmail(
  props: TransactionEmailProps
): Promise<string> {
  return await render(TransactionSuccessEmail(props));
}
