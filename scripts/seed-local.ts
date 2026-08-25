import { createClient } from '@libsql/client';
import { MOCK_CATEGORIES, MOCK_VENDORS, MOCK_MENU_ITEMS, MOCK_REVIEWS } from '../src/lib/mock-data';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Use environment variable for database path, default to local file
const DB_PATH = process.env.DATABASE_URL || 'file:db/local.db';
const dbDir = path.resolve('db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const client = createClient({ url: DB_PATH });

async function seed() {
  console.log(`🌱 Initializing local SQLite database (${DB_PATH})...`);

  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      opens_at TEXT NOT NULL,
      closes_at TEXT NOT NULL,
      delivers_to TEXT DEFAULT '[]' NOT NULL,
      image TEXT,
      is_active INTEGER DEFAULT 1 NOT NULL,
      is_featured INTEGER DEFAULT 0 NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      is_veg INTEGER DEFAULT 1 NOT NULL,
      is_available INTEGER DEFAULT 1 NOT NULL,
      tags TEXT DEFAULT '[]' NOT NULL,
      display_order INTEGER DEFAULT 0 NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Insert Categories
  for (const c of MOCK_CATEGORIES) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO categories (id, name, slug, icon, display_order) VALUES (?, ?, ?, ?, ?)`,
      args: [c.id, c.name, c.slug, c.icon, c.displayOrder]
    });
  }

  // Insert Vendors
  for (const v of MOCK_VENDORS) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [v.id, v.name, v.slug, v.phone, v.whatsapp, v.address, v.latitude, v.longitude, v.opensAt, v.closesAt, JSON.stringify(v.deliversTo), v.image, v.isActive ? 1 : 0, v.isFeatured ? 1 : 0, v.displayOrder]
    });
  }

  // Insert Menu Items
  for (const m of MOCK_MENU_ITEMS) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO menu_items (id, vendor_id, category_id, name, description, price, image, is_veg, is_available, tags, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [m.id, m.vendorId, m.categoryId, m.name, m.description || null, m.price, m.image || null, m.isVeg ? 1 : 0, m.isAvailable ? 1 : 0, JSON.stringify(m.tags), m.displayOrder]
    });
  }

  // Insert Reviews
  for (const r of MOCK_REVIEWS) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO reviews (id, menu_item_id, student_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [r.id, r.menuItemId, r.studentName, r.rating, r.comment, r.createdAt]
    });
  }

  // Insert default site settings
  await client.execute({
    sql: `INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)`,
    args: ['homepage_title', 'Hungry? We got you.']
  });
  await client.execute({
    sql: `INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)`,
    args: ['homepage_tagline', 'Search 20+ food stalls around NITKKR']
  });
  await client.execute({
    sql: `INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)`,
    args: ['contact_email', 'admin@nitkkr-food.com']
  });

  console.log('✅ Local database successfully seeded with 20 campus eateries, 100+ menu items, and initial student reviews!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});