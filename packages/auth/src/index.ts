import { db } from "@test-tss/db";
import * as schema from "@test-tss/db/schema/auth";
import { env } from "@test-tss/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const corsOrigins = env.CORS_ORIGIN.split(",");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  trustedOrigins: corsOrigins,
  emailAndPassword: {
    enabled: true,
  },
  // uncomment cookieCache setting when ready to deploy to Cloudflare using *.workers.dev domains
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 60,
  //   },
  // },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    // uncomment crossSubDomainCookies setting when ready to deploy and replace <your-workers-subdomain> with your actual workers subdomain
    // https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
    // crossSubDomainCookies: {
    //   enabled: true,
    //   domain: "<your-workers-subdomain>",
    // },
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
