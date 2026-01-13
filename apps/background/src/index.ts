import { env as backgroundEnv } from "@test-tss/env/background";
import { sendEmail } from "./queue/sendEmail";
import { expireTransaction } from "./schedule/expireTransaction";

if (backgroundEnv.IS_DEV === "true") {
  console.log(
    "Trigger Schedule Using:\n - http://localhost:3007/__scheduled?cron=* * * * *"
  );
}

export default {
  async queue(batch: MessageBatch<unknown>) {
    for (const message of batch.messages) {
      try {
        await sendEmail(message.body);
        message.ack();
      } catch (e) {
        console.error("Failed to process message", message.id, e);
      }
    }
  },
  scheduled(event: ScheduledEvent, _env: BackgroundEnv, ctx: ExecutionContext) {
    const cron = event.cron;
    console.log("Cron", cron);

    ctx.waitUntil(
      (async () => {
        switch (event.cron) {
          case "* * * * *":
          case "0 0 * * *":
          case "0 */6 * * *":
          case "0 12 * * MON":
            await expireTransaction();
            break;
          default:
            break;
        }
      })()
    );
  },
};
