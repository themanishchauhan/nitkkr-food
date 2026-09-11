#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const wranglerJsonPath = join(__dirname, "..", "dist", "server", "wrangler.json");

if (!existsSync(wranglerJsonPath)) {
  console.warn("⚠️ dist/server/wrangler.json not found. Run astro build first.");
  process.exit(0);
}

try {
  const content = JSON.parse(readFileSync(wranglerJsonPath, "utf-8"));
  content.name = "orandus-dev";
  content.vars = {
    ...content.vars,
    ENVIRONMENT: "development",
  };
  content.d1_databases = [
    {
      binding: "DB",
      database_name: "orandus-dev",
      database_id: "82c051aa-b543-404f-af41-dd75dc1b9b2e",
    },
  ];

  writeFileSync(wranglerJsonPath, JSON.stringify(content, null, 2), "utf-8");
  console.log("✅ Configured dist/server/wrangler.json for 'orandus-dev' (DB: orandus-dev / 82c051aa-b543-404f-af41-dd75dc1b9b2e).");
} catch (err) {
  console.error("❌ Failed to update dist/server/wrangler.json:", err);
  process.exit(1);
}
