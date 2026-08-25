import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

export { schema };

let activeD1Binding: any = null;

export function setActiveD1(d1: any) {
  if (d1 && typeof d1.prepare === 'function') {
    activeD1Binding = d1;
  }
}

export function getRawD1Binding(): any {
  return activeD1Binding || 
         (globalThis as any).DB || 
         (globalThis as any).__CF_ENV__?.DB || 
         (globalThis as any).env?.DB;
}

/**
 * Creates a chainable Promise-like mock that resolves to an empty array
 * for any Drizzle query chain when D1 is uninitialized.
 */
function createQueryProxy(result: any = []) {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve: any) => Promise.resolve(result).then(resolve);
      }
      if (prop === 'catch') {
        return (reject: any) => Promise.resolve(result).catch(reject);
      }
      if (prop === 'finally') {
        return (cb: any) => Promise.resolve(result).finally(cb);
      }
      return (...args: any[]) => new Proxy({}, handler);
    }
  };
  return new Proxy({}, handler);
}

/**
 * Creates a Drizzle database instance from the provided environment.
 * Pure Cloudflare D1 Native without Node.js dependencies.
 */
export function createDb(env?: { DB?: D1Database; [key: string]: any }): any {
  // Check for Cloudflare D1 binding
  const d1 = env?.DB || 
             (env as any)?.runtime?.env?.DB || 
             (env as any)?.locals?.runtime?.env?.DB ||
             getRawD1Binding();

  if (d1 && typeof d1.prepare === 'function') {
    setActiveD1(d1);
    return drizzleD1(d1, { schema });
  }

  // Pure in-memory safe mock database for local build/prerender steps
  return {
    select: (...args: any[]) => createQueryProxy([]),
    insert: (...args: any[]) => createQueryProxy([]),
    update: (...args: any[]) => createQueryProxy([]),
    delete: (...args: any[]) => createQueryProxy([]),
  };
}

/**
 * Get DB instance from Astro context (for API routes and pages)
 */
export function getDbFromContext(context: any): any {
  if (context?.locals?.db) {
    return context.locals.db;
  }
  const env = context?.locals?.runtime?.env || 
              context?.request?.env || 
              context?.env;
  return createDb(env ? { DB: env.DB || env } : undefined);
}