import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: "../../apps/server/.env",
});

console.log("Using environment file: ../../apps/server/.env");

const PUSH_CREDENTIALS = {
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
    token: process.env.CLOUDFLARE_API_TOKEN ?? "",
  },
  tablesFilter: ["!_cf_KV"],
};

// If run via CLI (i.e., process.argv contains 'drizzle-kit'), populate credentials
const isDrizzleCli = process.argv.some((arg) => arg.includes("drizzle-kit"));
const isStudio = process.argv.some((arg) => arg.includes("studio"));
const isPush = process.argv.some((arg) => arg.includes("push"));
const isLocal = process.env.DRIZZLE_LOCAL === "true";

// Get local SQLite file path for local operations
// Path is relative from packages/db to root .alchemy directory
const getLocalDbPath = () => {
  // Get the directory of this config file
  const configDir = dirname(fileURLToPath(import.meta.url));
  // Go up two levels to project root, then to .alchemy directory
  const dbDir = join(
    configDir,
    "../../.alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject"
  );
  try {
    const files = readdirSync(dbDir);
    const sqliteFile = files.find((file) => file.endsWith(".sqlite"));
    if (sqliteFile) {
      return join(dbDir, sqliteFile);
    }
  } catch {
    // Directory doesn't exist or can't read
  }
  return null;
};

const useLocal = (isStudio || isPush) && isLocal;
const localDbPath = useLocal ? getLocalDbPath() : null;

const LOCAL_CREDENTIALS = localDbPath
  ? {
      dbCredentials: {
        url: localDbPath,
      },
    }
  : {};

// Determine which credentials to use
let credentials = {};
if (useLocal && localDbPath) {
  credentials = LOCAL_CREDENTIALS;
} else if (isDrizzleCli) {
  credentials = PUSH_CREDENTIALS;
}

export default defineConfig({
  schema: "./src/schema",
  // out: "./src/migrations", // disable migration we use push
  // DOCS: https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
  dialect: "sqlite",
  tablesFilter: ['/^(?!.*_cf_KV).*$/'],
  // Only set driver for D1 HTTP, omit for local SQLite files (auto-detected from url)
  ...(useLocal && localDbPath ? {} : { driver: "d1-http" }),
  ...credentials,
});
