#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const tempSqlPath = join(__dirname, "temp-prod-dump.sql");
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "b03cd0ec64a8ee0ca62fb58adfca3afb";

console.log("=================================================");
console.log("🔄 Orandus: Syncing Production D1 -> Dev D1");
console.log("=================================================");

try {
  // Step 1: Export from production database (nitkkr-food)
  console.log("\n📦 Step 1/3: Exporting live data from 'nitkkr-food' (Prod)...");
  execSync(
    `npx wrangler d1 export nitkkr-food --remote --output="${tempSqlPath}"`,
    {
      stdio: "inherit",
      env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: accountId },
    }
  );

  if (!existsSync(tempSqlPath)) {
    throw new Error("Export file was not created.");
  }

  // Step 2: Make D1 dump idempotent by prepending DROP TABLE IF EXISTS for each table
  console.log("\n⚙️  Step 2/3: Preparing SQL dump for clean overwrite on dev...");
  let sql = readFileSync(tempSqlPath, "utf-8");

  // Prepend PRAGMA foreign_keys=OFF so drops and creates can happen in any order
  sql = "PRAGMA foreign_keys=OFF;\n" + sql;

  // Replace CREATE TABLE (or CREATE TABLE IF NOT EXISTS) with DROP TABLE IF EXISTS + CREATE TABLE
  sql = sql.replace(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"']?)([a-zA-Z0-9_]+)\1/gi, (match, quote, tableName) => {
    return `DROP TABLE IF EXISTS "${tableName}";\n${match}`;
  });

  writeFileSync(tempSqlPath, sql, "utf-8");

  // Step 3: Import into dev database (orandus-dev)
  console.log("\n🚀 Step 3/3: Importing data into 'orandus-dev' (Dev)...");
  execSync(
    `npx wrangler d1 execute orandus-dev --remote --file="${tempSqlPath}" -y`,
    {
      stdio: "inherit",
      env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: accountId },
    }
  );

  console.log("\n✅ Success! 'orandus-dev' is now 100% cloned from production.");
} catch (error) {
  console.error("\n❌ Sync failed:", error.message || error);
  process.exit(1);
} finally {
  if (existsSync(tempSqlPath)) {
    unlinkSync(tempSqlPath);
    console.log("🧹 Cleaned up temporary export file.");
  }
}
