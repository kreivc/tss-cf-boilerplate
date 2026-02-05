import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
    VITE_DISABLE_REGISTER: z
      .string()
      .optional()
      .default("true")
      .transform((val) => val === "true"),
  },
  runtimeEnv: (import.meta as unknown as { env: Record<string, string> }).env,
  emptyStringAsUndefined: true,
});
