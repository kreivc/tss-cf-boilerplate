/**
 * Type declarations for @test-tss/email/render
 *
 * This declaration file provides types without following
 * the JSX dependencies, allowing type-safe usage in projects
 * with different JSX configurations.
 */

export interface TransactionEmailProps {
  customerName?: string;
  transactionId?: string;
  gameName?: string;
  itemName?: string;
  amount?: number;
  date?: string;
}

export function renderTransactionSuccessEmail(
  props: TransactionEmailProps
): Promise<string>;
