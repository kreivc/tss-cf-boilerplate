import alchemy from "alchemy";
import {
  D1Database,
  KVNamespace,
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

export const web = await TanStackStart("web", {
  cwd: "../../apps/web",
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL ?? "",
    DB: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "",
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL ?? "",
  },
});

export const server = await Worker("server", {
  cwd: "../../apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    DB: db,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN ?? "",
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL ?? "",
    SESSION_KV: sessions,
  },
  dev: {
    port: 3000,
  },
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
