import type { SendEmailData } from "@test-tss/types";

// biome-ignore lint/suspicious/useAwait: ok
export async function sendEmail(data: SendEmailData) {
  console.log("Sending email", data);
}
