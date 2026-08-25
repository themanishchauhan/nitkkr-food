import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/schema';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as fs from 'fs';
import * as path from 'path';

const DB_DIR = path.resolve('db');
const DB_PATH = path.join(DB_DIR, 'local.db');
const MIGRATIONS_DIR = path.resolve('d1-migrations');

async function runMigrations() {
  console.log('🔄 Running local D1 migrations...');
  
  // Ensure db directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Ensure migrations directory exists
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('⚠️  No migrations directory found. Run `npm run db:push` first to generate migrations.');
    process.exit(1);
  }

  const client = createClient({ url: `file:${DB_PATH}` });
  const db = drizzle(client, { schema });

  try {
    console.log('📦 Applying migrations from', MIGRATIONS_DIR);
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
    console.log('✅ Local database migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

runMigrations().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});