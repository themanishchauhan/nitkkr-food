import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

let dbInstance: any = null;

/**
 * Creates a Drizzle database instance from the provided environment.
 * Pure Cloudflare D1 Native without Node.js dependencies.
 */
export function createDb(env?: { DB?: D1Database; DATABASE_URL?: string }): any {
  // Check for Cloudflare D1 binding (production)
  const d1 = env?.DB || 
             (globalThis as any).DB || 
             (globalThis as any).__CF_ENV__?.DB ||
             (globalThis as any).env?.DB || 
             (globalThis as any).__cf_env?.DB;

  if (d1 && typeof d1.prepare === 'function') {
    return drizzleD1(d1, { schema });
  }

  // Pure in-memory safe mock database for environments where D1 is initializing
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: () => [] }),
          limit: () => []
        }),
        orderBy: () => [],
        limit: () => []
      })
    }),
    insert: () => ({
      values: () => ({
        onConflictDoUpdate: () => ({ returning: () => [] }),
        returning: () => []
      })
    }),
    update: () => ({
      set: () => ({
        where: () => ({ returning: () => [] })
      })
    }),
    delete: () => ({
      where: () => []
    })
  };
}

/**
 * Get DB instance from Astro context (for API routes)
 */
export function getDbFromContext(context: any): any {
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