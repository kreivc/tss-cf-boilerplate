/**
 * Expire Transaction Scheduled Job
 *
 * Runs periodically to expire PENDING transactions older than 3 hours.
 */

import { db } from "@test-tss/db";
import { transactions } from "@test-tss/db/schema/transaction";
import { and, eq, lt } from "drizzle-orm";

/**
 * Expire transactions that have been PENDING for more than 3 hours
 */
export async function expireTransaction(): Promise<void> {
  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const threeHoursAgoIso = threeHoursAgo.toISOString();

  console.log("[expireTransaction] Checking for expired transactions", {
    cutoffTime: threeHoursAgoIso,
  });

  try {
    // Find and update expired transactions
    const result = await db
      .update(transactions)
      .set({
        status: "EXPIRED",
        updatedAt: now.toISOString(),
        updatedBy: "cron:expire-transaction",
      })
      .where(
        and(
          eq(transactions.status, "PENDING"),
          lt(transactions.createdAt, threeHoursAgoIso)
        )
      )
      .returning({ id: transactions.id });

    if (result.length > 0) {
      console.log("[expireTransaction] Expired transactions:", {
        count: result.length,
        ids: result.map((r) => r.id),
      });
    } else {
      console.log("[expireTransaction] No transactions to expire");
    }
  } catch (error) {
    console.error(
      "[expireTransaction] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
}
