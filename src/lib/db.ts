import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDbFromEnv(env?: any) {
  const d1 = env?.DB || 
             (globalThis as any).DB || 
             (globalThis as any).env?.DB || 
             (globalThis as any).__cf_env?.DB ||
             (globalThis as any).process?.env?.DB;

  if (!d1 || typeof d1.prepare !== 'function') {
    throw new Error('D1 Database binding (DB) not available');
  }

  return drizzle(d1, { schema });
}

export function getDb(env?: any) {
  return getDbFromEnv(env);
}

export const db: any = {
  select: () => { throw new Error('Use getDbFromEnv(env)'); }
};

export { schema };