import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb(d1: any) {
  if (!dbInstance) {
    dbInstance = drizzle(d1, { schema });
  }
  return dbInstance;
}

export function getDbFromEnv() {
  const d1 = (globalThis as any).DB || (globalThis as any).env?.DB;
  if (!d1) {
    console.warn('D1 database not available - using mock');
    return new Proxy({}, {
      get() {
        return () => Promise.resolve([]);
      }
    }) as any;
  }
  return getDb(d1);
}

export const db: any = getDbFromEnv();

export { schema };