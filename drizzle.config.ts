import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './d1-migrations',
  dialect: 'sqlite',
});