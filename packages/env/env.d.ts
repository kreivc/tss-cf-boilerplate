import type { backgroundWorker, server } from "@test-tss/infra/alchemy.run";

// This file infers types for the cloudflare:workers environment from your Alchemy Worker.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

export type CloudflareEnv = typeof server.Env;

declare global {
  type Env = CloudflareEnv;
  type BackgroundEnv = typeof backgroundWorker.Env;
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
