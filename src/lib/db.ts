import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { D1Database } from '@cloudflare/workers-types';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

type Database = DrizzleD1Database<typeof schema> | LibSQLDatabase<typeof schema>;

let localDbInstance: LibSQLDatabase<typeof schema> | null = null;

/**
 * Creates a Drizzle database instance from the provided environment.
 * Works with both Cloudflare D1 (production) and libSQL (local development).
 */
export function createDb(env?: { DB?: D1Database; DATABASE_URL?: string }): Database {
  // Check for Cloudflare D1 binding (production)
  const d1 = env?.DB || 
             (globalThis as any).DB || 
             (globalThis as any).env?.DB || 
             (globalThis as any).__cf_env?.DB;

  if (d1 && typeof d1.prepare === 'function') {
    return drizzleD1(d1, { schema });
  }

  // Fallback to libSQL for local development
  try {
    const databaseUrl = env?.DATABASE_URL || 
                        process.env.DATABASE_URL || 
                        'file:db/local.db';

    if (!localDbInstance) {
      const client = createClient({ url: databaseUrl });
      localDbInstance = drizzleLibSql(client, { schema });
    }
    return localDbInstance;
  } catch (err) {
    // In Cloudflare Worker environment where libSQL local file cannot be opened
    return {
      select: () => ({ from: () => ({ where: () => ({ orderBy: () => ({ limit: () => [] }), limit: () => [] }), orderBy: () => [], limit: () => [] }) }),
      insert: () => ({ values: () => ({ onConflictDoUpdate: () => ({ returning: () => [] }), returning: () => [] }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
      delete: () => ({ where: () => [] }),
    } as any;
  }
}


/**
 * Get DB instance from Astro context (for API routes)
 */
export function getDbFromContext(context: any): Database {
  // Try to get env from various places in Astro context
  const env = context?.locals?.runtime?.env || 
              context?.request?.env || 
              (globalThis as any).env ||
              context?.env;
  
  return createDb(env);
}

export const getDbFromEnv = createDb;

export const db = {
  select: (...args: any[]) => createDb().select(...args),
  insert: (...args: any[]) => createDb().insert(...args),
  update: (...args: any[]) => createDb().update(...args),
  delete: (...args: any[]) => createDb().delete(...args),
};

export { schema };