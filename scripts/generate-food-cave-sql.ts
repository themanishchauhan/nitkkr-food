import { FOOD_CAVE_VENDOR, FOOD_CAVE_MENU_ITEMS } from '../src/lib/food-cave-data';
import * as fs from 'fs';
import * as path from 'path';

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

let sql = `-- Seed Food Cave Fast Food and 172 Menu Items
INSERT OR IGNORE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
VALUES (
  ${FOOD_CAVE_VENDOR.id},
  ${escapeSql(FOOD_CAVE_VENDOR.name)},
  ${escapeSql(FOOD_CAVE_VENDOR.slug)},
  ${escapeSql(FOOD_CAVE_VENDOR.phone)},
  ${escapeSql(FOOD_CAVE_VENDOR.whatsapp)},
  ${escapeSql(FOOD_CAVE_VENDOR.address)},
  ${FOOD_CAVE_VENDOR.latitude},
  ${FOOD_CAVE_VENDOR.longitude},
  ${escapeSql(FOOD_CAVE_VENDOR.opensAt)},
  ${escapeSql(FOOD_CAVE_VENDOR.closesAt)},
  ${escapeSql(JSON.stringify(FOOD_CAVE_VENDOR.deliversTo))},
  ${escapeSql(FOOD_CAVE_VENDOR.image)},
  ${FOOD_CAVE_VENDOR.isActive ? 1 : 0},
  ${FOOD_CAVE_VENDOR.isFeatured ? 1 : 0},
  ${FOOD_CAVE_VENDOR.displayOrder}
);

`;

for (const item of FOOD_CAVE_MENU_ITEMS) {
  sql += `INSERT OR IGNORE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
VALUES (
  ${item.id},
  ${item.vendorId},
  ${item.categoryId},
  ${escapeSql(item.name)},
  ${escapeSql(item.description)},
  ${parseFloat(item.price)},
  ${item.isVeg ? 1 : 0},
  ${item.isAvailable ? 1 : 0},
  ${escapeSql(JSON.stringify(item.tags))},
  ${item.displayOrder}
);\n`;
}

const outPath = path.resolve('d1-migrations/0001_seed_food_cave.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated ${outPath} with ${FOOD_CAVE_MENU_ITEMS.length} dishes.`);
