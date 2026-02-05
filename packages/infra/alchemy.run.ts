import alchemy from "alchemy";
import {
  D1Database,
  KVNamespace,
  Queue,
  R2Bucket,
  TanStackStart,
  Worker,
} from "alchemy/cloudflare";
import { config } from "dotenv";

// Detect deploy environment
const isDeploy = process.env.DEPLOY === "true";

if (isDeploy) {
  console.log("Deploying to production environment");
} else {
  console.log("Running infrastructure in development mode");
}

// Domain configuration for production
const DOMAIN = "flazbit.com";

// Load appropriate .env files based on environment
const envSuffix = isDeploy ? ".prod" : "";
config({ path: `./.env${envSuffix}` });
config({ path: `../../apps/web/.env${envSuffix}` });
config({ path: `../../apps/server/.env${envSuffix}` });

const app = await alchemy("test-tss");

const db = await D1Database("database", {
  migrationsDir: "../../packages/db/src/migrations",
});

const sessions = await KVNamespace("sessions", {
  title: `${app.name}-user-sessions`,
  adopt: true,
});

const isDev = !isDeploy;
const corsOrigin = (alchemy.env.CORS_ORIGIN ?? "").split(",");

export const web = await TanStackStart("web", {
  cwd: "../../apps/web",
  domains: [DOMAIN],
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL ?? "",
    VITE_DISABLE_REGISTER: alchemy.env.VITE_DISABLE_REGISTER ?? "true",
    DB: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "",
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL ?? "",
    SESSION_KV: sessions,
    IS_DEV: isDev ? "true" : "false",
  },
});

const bucket = await R2Bucket("my-bucket", {
  name: `${app.name}-${app.stage}-bucket`,
  devDomain: true,
  domains: [`cdn.${DOMAIN}`],
  dev: {
    remote: true,
  },
  cors: [
    {
      allowed: {
        origins: corsOrigin,
        methods: ["PUT", "GET"],
        headers: ["*"],
      },
      exposeHeaders: ["ETag"],
      maxAgeSeconds: 3600,
    },
  ],
});

export const queue = await Queue("queue", {
  name: `${app.name}-${app.stage}-queue`,
});

export const dlq = await Queue("dlq", {
  name: `${app.name}-${app.stage}-dlq`,
});

export const backgroundWorker = await Worker("background-jobs", {
  cwd: "../../apps/background",
  domains: [`worker.${DOMAIN}`],
  entrypoint: "src/index.ts",
  bindings: {
    DB: db, // Binding your shared D1 database
    QUEUE: queue,
    // IPAYMU
    IPAYMU_BASE_URL: alchemy.env.IPAYMU_BASE_URL ?? "",
    IPAYMU_API_KEY: alchemy.env.IPAYMU_API_KEY ?? "",
    IPAYMU_VA: alchemy.env.IPAYMU_VA ?? "",
    IPAYMU_CALLBACK_URL: alchemy.env.IPAYMU_CALLBACK_URL ?? "",
    // RESEND
    RESEND_API_KEY: alchemy.secret.env.RESEND_API_KEY ?? "",
    // dev
    IS_DEV: isDev ? "true" : "false",
  },
  eventSources: [
    {
      queue,
      settings: {
        batchSize: 10,
        maxConcurrency: 5, // Prevents overwhelming your database
        deadLetterQueue: dlq,
      },
    },
  ],
  // crons: ["* * * * *", "0 0 * * *", "0 */6 * * *", "0 12 * * MON"],
  crons: ["*/5 * * * *"], // Every 5 minutes for transaction expiration
  dev: {
    port: 3007,
  },
});

export const server = await Worker("server", {
  cwd: "../../apps/server",
  domains: [`api.${DOMAIN}`],
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    QUEUE: queue,
    BUCKET: bucket,
    DB: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "",
    BASE_FRONTEND_URL: alchemy.env.BASE_FRONTEND_URL ?? "",
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL ?? "",
    SESSION_KV: sessions,
    R2_ACCESS_KEY_ID: alchemy.env.R2_ACCESS_KEY_ID ?? "",
    R2_SECRET_ACCESS_KEY: alchemy.env.R2_SECRET_ACCESS_KEY ?? "",
    R2_BUCKET_NAME: bucket.name,
    R2_CDN_URL: `https://${bucket.domains?.[0] ?? ""}`,
    CLOUDFLARE_ACCOUNT_ID: alchemy.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    // IPAYMU
    IPAYMU_BASE_URL: alchemy.env.IPAYMU_BASE_URL ?? "",
    IPAYMU_API_KEY: alchemy.env.IPAYMU_API_KEY ?? "",
    IPAYMU_VA: alchemy.env.IPAYMU_VA ?? "",
    IPAYMU_CALLBACK_URL: alchemy.env.IPAYMU_CALLBACK_URL ?? "",
    // dev
    IS_DEV: isDev ? "true" : "false",
  },
  dev: {
    port: 3000,
  },
});

if (isDev) {
  console.log(`Web    -> ${web.url}`);
  console.log(`Server -> ${server.url}`);
  console.log(`Background Worker -> ${backgroundWorker.url}`);
  console.log(`Bucket URL -> https://${bucket.domains?.[0]}`);
} else {
  console.log(`Web    -> https://${web.baseUrl}`);
  console.log(`Server -> https://${server.baseUrl}`);
  console.log(`Background Worker -> https://${backgroundWorker.baseUrl}`);
  console.log(`Bucket URL -> https://${bucket.domains?.[0]}`);
}

await app.finalize();
