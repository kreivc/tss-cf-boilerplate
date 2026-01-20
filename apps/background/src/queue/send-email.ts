/**
 * Email Queue Handler
 *
 * Sends emails using Resend API with react-email templates.
 */

import { env } from "cloudflare:workers";
import {
  renderTransactionSuccessEmail,
  type TransactionEmailProps,
} from "@test-tss/email/render";
import { Resend } from "resend";
import type { SendEmailData } from "../types";

/**
 * Send an email using Resend
 */
export async function sendEmail(data: SendEmailData): Promise<void> {
  console.log("[sendEmail] Processing:", {
    to: data.email,
    subject: data.subject,
  });

  // Validate API key
  if (!env.RESEND_API_KEY) {
    console.error("[sendEmail] RESEND_API_KEY not configured");
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);

    // Render email based on whether we have transaction details
    let html: string;
    if (data.transactionDetails) {
      const emailProps: TransactionEmailProps = {
        customerName: data.name,
        transactionId: data.transactionDetails.transactionId,
        gameName: data.transactionDetails.gameName,
        itemName: data.transactionDetails.itemName,
        amount: data.transactionDetails.amount,
        date: data.transactionDetails.date,
      };
      html = await renderTransactionSuccessEmail(emailProps);
    } else {
      // Fallback to plain text wrapped in basic HTML
      html = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <p>${data.text.replace(/\n/g, "<br>")}</p>
          </body>
        </html>
      `;
    }

    const { data: result, error } = await resend.emails.send({
      from: "FlazBit <noreply@notification.flazbit.com>",
      to: [data.email],
      subject: data.subject,
      html,
      text: data.text,
    });

    if (error) {
      console.error("[sendEmail] Resend error:", error.message);
      throw new Error(error.message);
    }

    console.log("[sendEmail] Sent successfully:", {
      id: result?.id,
      to: data.email,
    });
  } catch (error) {
    console.error(
      "[sendEmail] Failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error; // Re-throw to trigger queue retry
  }
}
