import { db } from "@test-tss/db";
import * as schema from "@test-tss/db/schema/auth";
import { env } from "@test-tss/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, username } from "better-auth/plugins";

const corsOrigins = env.CORS_ORIGIN.split(",");

const getDomain = () => {
  try {
    const url = new URL(env.BETTER_AUTH_URL);
    const hostname = url.hostname;
    const firstDot = hostname.indexOf(".");
    if (firstDot !== -1) {
      return hostname.slice(firstDot);
    }
    return "";
  } catch {
    return "";
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  trustedOrigins: corsOrigins,
  plugins: [admin(), username()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength: 32,
  },
  // uncomment cookieCache setting when ready to deploy to Cloudflare using *.workers.dev domains
  session: {
    cookieCache: {
      enabled: env.IS_DEV === "false", // disable cookieCache in development prevent stale data
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    storeSessionInDatabase: true,
    preserveSessionInDatabase: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL, // !Comment me when generating schema
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    // uncomment crossSubDomainCookies setting when ready to deploy and replace <your-workers-subdomain> with your actual workers subdomain
    // https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
    crossSubDomainCookies: {
      enabled: env.IS_DEV === "false", // disable on localhost
      domain: getDomain(),
    },
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await env.SESSION_KV.get(key);
      return value;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await env.SESSION_KV.put(key, value, { expirationTtl: ttl });
      } else {
        await env.SESSION_KV.put(key, value);
      }
    },
    delete: async (key) => {
      await env.SESSION_KV.delete(key);
    },
  },
  rateLimit: {
    storage: "secondary-storage",
  },
});
