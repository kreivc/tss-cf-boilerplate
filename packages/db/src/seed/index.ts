import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@libsql/client/sqlite3';
import dotenv from 'dotenv';
import { drizzle as sqliteDrizzle } from 'drizzle-orm/libsql';
import { drizzle as proxyDrizzle } from 'drizzle-orm/sqlite-proxy';

import * as schema from '../schema';
import { seedGames, seedItems, seedItemDetails } from './game';

// Load environment variables from apps/server/.env
dotenv.config({
  path: '../../apps/server/.env',
});

const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_API_TOKEN } = process.env;

// D1 HTTP proxy callback for remote database operations
const d1HttpCallback: Parameters<typeof proxyDrizzle>[0] = async (sql, params, method) => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/${
      method === 'values' ? 'raw' : 'query'
    }`,
    {
      method: 'POST',
      body: JSON.stringify({ sql, params }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
    }
  );

  const data = (await res.json()) as
    | {
        success: true;
        result: {
          results: unknown[] | { columns: string[]; rows: unknown[][] };
        }[];
      }
    | { success: false; errors: { code: number; message: string }[] };

  if (!data.success) {
    throw new Error(data.errors.map((it) => `${it.code}: ${it.message}`).join('\n'));
  }

  const result = data.result[0]!.results;
  const rows = Array.isArray(result) ? result : result.rows;

  return { rows };
};

// Get local SQLite file path (reusing logic from drizzle.config.ts)
const getLocalDbPath = () => {
  const configDir = dirname(fileURLToPath(import.meta.url));
  // src/seed -> src -> packages/db -> packages -> root
  const dbDir = join(configDir, '../../../../.alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject');

  try {
    const files = readdirSync(dbDir);
    const sqliteFile = files.find((file) => file.endsWith('.sqlite'));
    if (sqliteFile) {
      return join(dbDir, sqliteFile);
    }
  } catch {
    // Directory doesn't exist or can't read
  }
  return null;
};

// Export type for use in seed modules
export type DrizzleInstance = ReturnType<typeof sqliteDrizzle<typeof schema>> | ReturnType<typeof proxyDrizzle<typeof schema>>;

async function createDatabaseConnection(isRemote: boolean): Promise<DrizzleInstance> {
  if (isRemote) {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
      throw new Error(
        'Missing required environment variables for remote seeding: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_API_TOKEN'
      );
    }
    console.log('📡 Connecting to remote D1 database...');
    return proxyDrizzle(d1HttpCallback, { schema });
  }

  const localDbPath = getLocalDbPath();
  if (!localDbPath) {
    throw new Error(
      'Could not find the local D1 database file. Make sure you have run the dev server at least once.'
    );
  }

  console.log(`📁 Connecting to local database: ${localDbPath}`);
  return sqliteDrizzle(createClient({ url: `file:${localDbPath}` }), { schema });
}

async function main() {
  const isRemote = process.argv.includes('--remote');
  const target = isRemote ? 'remote (Cloudflare D1)' : 'local';

  console.log(`\n🌱 Starting database seed (${target})...\n`);

  try {
    const db = await createDatabaseConnection(isRemote);

    // Run all seed functions
    await seedGames(db);
    await seedItems(db);
    await seedItemDetails(db);

    console.log('\n✨ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
