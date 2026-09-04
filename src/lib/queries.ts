import { createDb, schema, getRawD1Binding } from './db';
import { eq, and, asc, sql, desc } from 'drizzle-orm';
import { MOCK_VENDORS, MOCK_CATEGORIES, MOCK_MENU_ITEMS, MOCK_REVIEWS } from './mock-data';
import { FOOD_CAVE_VENDOR, FOOD_CAVE_MENU_ITEMS } from './food-cave-data';
import { APNA_FAST_FOOD_VENDOR, APNA_FAST_FOOD_MENU_ITEMS } from './apna-fast-food-data';
import { SURAJ_VENDOR, SURAJ_MENU_ITEMS } from './suraj-restaurant-data';
import { FOOD_POINT_VENDOR, FOOD_POINT_MENU_ITEMS } from './food-point-data';
import { HANGRY_CLUB_VENDOR, HANGRY_CLUB_MENU_ITEMS } from './hangry-club-data';
import { RAHUL_FAST_FOOD_VENDOR, RAHUL_FAST_FOOD_MENU_ITEMS } from './rahul-fast-food-data';
import { EAT_AND_FUN_VENDOR, EAT_AND_FUN_MENU_ITEMS } from './eat-and-fun-data';
import { CHEF_ON_FOOD_JUNCTION_VENDOR, CHEF_ON_FOOD_JUNCTION_MENU_ITEMS } from './chef-on-food-junction-data';
import { BAKERS_BITE_KKR_VENDOR, BAKERS_BITE_KKR_MENU_ITEMS } from './bakers-bite-kkr-data';
import { ASHU_FAST_FOOD_VENDOR, ASHU_FAST_FOOD_MENU_ITEMS } from './ashu-fast-food-data';
import { THE_SPICE_CHAMBER_VENDOR, THE_SPICE_CHAMBER_MENU_ITEMS } from './the-spice-chamber-data';
import { CAFE_AROMA_VENDOR, CAFE_AROMA_MENU_ITEMS } from './cafe-aroma-data';
import { ANTY_JI_TEA_STALL_VENDOR, ANTY_JI_TEA_STALL_MENU_ITEMS } from './anty-ji-tea-stall-data';
import { AMAN_FAST_FOOD_VENDOR, AMAN_FAST_FOOD_MENU_ITEMS } from './aman-fast-food-data';
import { YUMMY_TUMMY_FOODS_VENDOR, YUMMY_TUMMY_FOODS_MENU_ITEMS } from './yummy-tummy-foods-data';

const isDev = process.env.NODE_ENV !== 'production';

let hasCheckedD1Seed = false;

export async function ensureRealDatabasePopulated(d1Raw?: any) {
  const d1 = d1Raw || getRawD1Binding();
  if (!d1 || typeof d1.prepare !== 'function') return;

  try {
    // 0. Ensure all production tables exist with proper schema
    await d1.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL
      )
    `).run();

    await d1.prepare(`
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
      )
    `).run();

    await d1.prepare(`
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
      )
    `).run();

    await d1.prepare(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_item_id INTEGER NOT NULL,
        student_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `).run();

    await d1.prepare(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `).run();

    await d1.prepare(`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        category TEXT DEFAULT 'Explore' NOT NULL,
        icon TEXT DEFAULT '📄',
        content TEXT NOT NULL,
        show_in_footer INTEGER DEFAULT 1 NOT NULL,
        is_published INTEGER DEFAULT 1 NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `).run();

    // 1. Ensure Categories exist in D1
    for (const cat of MOCK_CATEGORIES) {
      await d1.prepare(`
        INSERT OR IGNORE INTO categories (id, name, slug, icon, display_order)
        VALUES (?, ?, ?, ?, ?)
      `).bind(cat.id, cat.name, cat.slug, cat.icon, cat.displayOrder).run();
    }

    // 2. Ensure Vendors exist in Real D1 Database
    const vendorsToSeed = [
      FOOD_CAVE_VENDOR, 
      APNA_FAST_FOOD_VENDOR, 
      SURAJ_VENDOR,
      FOOD_POINT_VENDOR,
      HANGRY_CLUB_VENDOR,
      RAHUL_FAST_FOOD_VENDOR,
      EAT_AND_FUN_VENDOR,
      CHEF_ON_FOOD_JUNCTION_VENDOR,
      BAKERS_BITE_KKR_VENDOR,
      ASHU_FAST_FOOD_VENDOR,
      THE_SPICE_CHAMBER_VENDOR,
      CAFE_AROMA_VENDOR,
      ANTY_JI_TEA_STALL_VENDOR,
      AMAN_FAST_FOOD_VENDOR,
      YUMMY_TUMMY_FOODS_VENDOR
    ];
    for (const vendor of vendorsToSeed) {
      const check = await d1.prepare(`SELECT id FROM vendors WHERE slug = ? OR id = ? LIMIT 1`)
        .bind(vendor.slug, vendor.id)
        .first();

      if (!check) {
        console.log(`🌱 Inserting ${vendor.name} into Real D1 Database...`);
        await d1.prepare(`
          INSERT INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          vendor.id,
          vendor.name,
          vendor.slug,
          vendor.phone,
          vendor.whatsapp,
          vendor.address,
          vendor.latitude,
          vendor.longitude,
          vendor.opensAt,
          vendor.closesAt,
          JSON.stringify(vendor.deliversTo),
          vendor.image,
          vendor.isActive ? 1 : 0,
          vendor.isFeatured ? 1 : 0,
          vendor.displayOrder
        ).run();
      } else {
        await d1.prepare(`UPDATE vendors SET phone = ?, whatsapp = ?, address = ?, latitude = ?, longitude = ?, delivers_to = ?, opens_at = ?, closes_at = ? WHERE slug = ?`)
          .bind(vendor.phone, vendor.whatsapp, vendor.address, vendor.latitude, vendor.longitude, JSON.stringify(vendor.deliversTo), vendor.opensAt, vendor.closesAt, vendor.slug)
          .run();
      }
    }

    // 3. Ensure Menu Items exist
    const allDishes = [
      ...FOOD_CAVE_MENU_ITEMS, 
      ...APNA_FAST_FOOD_MENU_ITEMS, 
      ...SURAJ_MENU_ITEMS, 
      ...FOOD_POINT_MENU_ITEMS, 
      ...HANGRY_CLUB_MENU_ITEMS, 
      ...RAHUL_FAST_FOOD_MENU_ITEMS, 
      ...EAT_AND_FUN_MENU_ITEMS, 
      ...CHEF_ON_FOOD_JUNCTION_MENU_ITEMS, 
      ...BAKERS_BITE_KKR_MENU_ITEMS, 
      ...ASHU_FAST_FOOD_MENU_ITEMS, 
      ...THE_SPICE_CHAMBER_MENU_ITEMS, 
      ...CAFE_AROMA_MENU_ITEMS, 
      ...ANTY_JI_TEA_STALL_MENU_ITEMS,
      ...AMAN_FAST_FOOD_MENU_ITEMS,
      ...YUMMY_TUMMY_FOODS_MENU_ITEMS
    ];
    const statements: any[] = [];
    for (const item of allDishes) {
      statements.push(
        d1.prepare(`
          INSERT OR REPLACE INTO menu_items (id, vendor_id, category_id, name, description, price, is_veg, is_available, tags, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          item.id,
          item.vendorId,
          item.categoryId,
          item.name,
          item.description || null,
          parseFloat(item.price),
          item.isVeg ? 1 : 0,
          item.isAvailable ? 1 : 0,
          JSON.stringify(item.tags),
          item.displayOrder
        )
      );
    }

    if (statements.length > 0) {
      if (typeof d1.batch === 'function') {
        for (let i = 0; i < statements.length; i += 50) {
          await d1.batch(statements.slice(i, i + 50));
        }
      } else {
        for (const stmt of statements) {
          await stmt.run();
        }
      }
    }
    hasCheckedD1Seed = true;
  } catch (err) {
    console.error('Database populate error:', err);
  }
}

function getDb(customDb?: any) {
  return customDb || createDb();
}

export async function getActiveVendors() {
  try {
    ensureRealDatabasePopulated().catch(() => {});
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(eq(schema.vendors.isActive, true))
      .orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
    if (result && result.length > 0) {
      // Ensure all 7 campus stalls exist in result without ordering bias
      let combined = [...result];
      for (const mv of MOCK_VENDORS) {
        if (!combined.some((v: any) => v.slug === mv.slug || v.id === mv.id)) {
          combined.push(mv);
        }
      }
      return combined;
    }
    return MOCK_VENDORS.filter(v => v.isActive);
  } catch (e) {
    return MOCK_VENDORS.filter(v => v.isActive);
  }
}

export async function getVendorBySlug(slug: string) {
  try {
    ensureRealDatabasePopulated().catch(() => {});
    if (slug === 'food-cave') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, slug), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return FOOD_CAVE_VENDOR;
    }

    if (slug === 'apna-fast-food' || slug === 'apna-fresh-fast-food') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'apna-fast-food'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return APNA_FAST_FOOD_VENDOR;
    }

    if (slug === 'suraj-restaurant' || slug === 'suraj') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'suraj-restaurant'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return SURAJ_VENDOR;
    }

    if (slug === 'food-point') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'food-point'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return FOOD_POINT_VENDOR;
    }

    if (slug === 'the-hangry-club' || slug === 'hangry-club') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'the-hangry-club'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return HANGRY_CLUB_VENDOR;
    }

    if (slug === 'rahul-fast-food' || slug === 'rahul') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'rahul-fast-food'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return RAHUL_FAST_FOOD_VENDOR;
    }

    if (slug === 'eat-and-fun' || slug === 'eat-and-fun-restaurant') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'eat-and-fun'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return EAT_AND_FUN_VENDOR;
    }

    if (slug === 'chef-on-food-junction' || slug === 'chef-on') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'chef-on-food-junction'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return CHEF_ON_FOOD_JUNCTION_VENDOR;
    }

    if (slug === 'bakers-bite-kkr' || slug === 'bakers-bite') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'bakers-bite-kkr'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return BAKERS_BITE_KKR_VENDOR;
    }

    if (slug === 'ashu-fast-food' || slug === 'ashu') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'ashu-fast-food'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return ASHU_FAST_FOOD_VENDOR;
    }

    if (slug === 'the-spice-chamber' || slug === 'spice-chamber' || slug === 'tsc') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'the-spice-chamber'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return THE_SPICE_CHAMBER_VENDOR;
    }

    if (slug === 'cafe-aroma' || slug === 'aroma') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'cafe-aroma'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return CAFE_AROMA_VENDOR;
    }

    if (slug === 'aman-fast-food' || slug === 'aman') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'aman-fast-food'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return AMAN_FAST_FOOD_VENDOR;
    }

    if (slug === 'anty-ji-tea-stall' || slug === 'anty-ji' || slug === 'aunty-ji' || slug === 'anty-ji-stall') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'anty-ji-tea-stall'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return ANTY_JI_TEA_STALL_VENDOR;
    }

    if (slug === 'yummy-tummy-foods' || slug === 'yummy-tummy' || slug === 'yummy' || slug === 'yummy-tummy-foods-and-guest-house') {
      const db = getDb();
      const result = await db.select()
        .from(schema.vendors)
        .where(and(eq(schema.vendors.slug, 'yummy-tummy-foods'), eq(schema.vendors.isActive, true)))
        .limit(1);
      if (result && result[0]) return result[0];
      return YUMMY_TUMMY_FOODS_VENDOR;
    }

    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.slug, slug), eq(schema.vendors.isActive, true)))
      .limit(1);
    if (result && result[0]) return result[0];
    return MOCK_VENDORS.find(v => (v.slug === slug || (slug.startsWith('yummy') && v.slug === 'yummy-tummy-foods') || (slug.startsWith('aman') && v.slug === 'aman-fast-food') || (slug.startsWith('anty') && v.slug === 'anty-ji-tea-stall') || (slug.startsWith('aunty') && v.slug === 'anty-ji-tea-stall') || (slug.startsWith('cafe') && v.slug === 'cafe-aroma') || (slug.startsWith('aroma') && v.slug === 'cafe-aroma') || (slug.startsWith('spice') && v.slug === 'the-spice-chamber') || (slug.startsWith('ashu') && v.slug === 'ashu-fast-food') || (slug.startsWith('baker') && v.slug === 'bakers-bite-kkr') || (slug.startsWith('chef') && v.slug === 'chef-on-food-junction') || (slug.startsWith('eat') && v.slug === 'eat-and-fun') || (slug.startsWith('rahul') && v.slug === 'rahul-fast-food') || (slug.startsWith('hangry') && v.slug === 'the-hangry-club') || (slug.startsWith('suraj') && v.slug === 'suraj-restaurant') || (slug.startsWith('apna') && v.slug === 'apna-fast-food')) && v.isActive) || null;
  } catch (e) {
    if (slug === 'food-cave') return FOOD_CAVE_VENDOR;
    if (slug === 'apna-fast-food' || slug === 'apna-fresh-fast-food') return APNA_FAST_FOOD_VENDOR;
    if (slug === 'suraj-restaurant' || slug === 'suraj') return SURAJ_VENDOR;
    if (slug === 'food-point') return FOOD_POINT_VENDOR;
    if (slug === 'the-hangry-club' || slug === 'hangry-club') return HANGRY_CLUB_VENDOR;
    if (slug === 'rahul-fast-food' || slug === 'rahul') return RAHUL_FAST_FOOD_VENDOR;
    if (slug === 'eat-and-fun' || slug === 'eat-and-fun-restaurant') return EAT_AND_FUN_VENDOR;
    if (slug === 'chef-on-food-junction' || slug === 'chef-on') return CHEF_ON_FOOD_JUNCTION_VENDOR;
    if (slug === 'bakers-bite-kkr' || slug === 'bakers-bite') return BAKERS_BITE_KKR_VENDOR;
    if (slug === 'ashu-fast-food' || slug === 'ashu') return ASHU_FAST_FOOD_VENDOR;
    if (slug === 'the-spice-chamber' || slug === 'spice-chamber' || slug === 'tsc') return THE_SPICE_CHAMBER_VENDOR;
    if (slug === 'cafe-aroma' || slug === 'aroma') return CAFE_AROMA_VENDOR;
    if (slug === 'aman-fast-food' || slug === 'aman') return AMAN_FAST_FOOD_VENDOR;
    if (slug === 'anty-ji-tea-stall' || slug === 'anty-ji' || slug === 'aunty-ji' || slug === 'anty-ji-stall') return ANTY_JI_TEA_STALL_VENDOR;
    if (slug === 'yummy-tummy-foods' || slug === 'yummy-tummy' || slug === 'yummy' || slug === 'yummy-tummy-foods-and-guest-house') return YUMMY_TUMMY_FOODS_VENDOR;
    return MOCK_VENDORS.find(v => (v.slug === slug || (slug.startsWith('yummy') && v.slug === 'yummy-tummy-foods') || (slug.startsWith('aman') && v.slug === 'aman-fast-food') || (slug.startsWith('anty') && v.slug === 'anty-ji-tea-stall') || (slug.startsWith('aunty') && v.slug === 'anty-ji-tea-stall') || (slug.startsWith('cafe') && v.slug === 'cafe-aroma') || (slug.startsWith('aroma') && v.slug === 'cafe-aroma') || (slug.startsWith('spice') && v.slug === 'the-spice-chamber') || (slug.startsWith('ashu') && v.slug === 'ashu-fast-food') || (slug.startsWith('baker') && v.slug === 'bakers-bite-kkr') || (slug.startsWith('chef') && v.slug === 'chef-on-food-junction') || (slug.startsWith('eat') && v.slug === 'eat-and-fun') || (slug.startsWith('rahul') && v.slug === 'rahul-fast-food') || (slug.startsWith('hangry') && v.slug === 'the-hangry-club') || (slug.startsWith('suraj') && v.slug === 'suraj-restaurant') || (slug.startsWith('apna') && v.slug === 'apna-fast-food')) && v.isActive) || null;
  }
}

export async function getFeaturedVendors(limit = 5) {
  try {
    ensureRealDatabasePopulated().catch(() => {});
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.isActive, true), eq(schema.vendors.isFeatured, true)))
      .orderBy(asc(schema.vendors.displayOrder))
      .limit(limit);
    if (result && result.length > 0) {
      return result;
    }
    return MOCK_VENDORS.filter(v => v.isActive && v.isFeatured).slice(0, limit);
  } catch (e) {
    return MOCK_VENDORS.filter(v => v.isActive && v.isFeatured).slice(0, limit);
  }
}

export async function getCategories() {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    if (result && result.length > 0) return result;
    return MOCK_CATEGORIES;
  } catch (e) {
    return MOCK_CATEGORIES;
  }
}

export async function getMenuItemsByVendor(vendorId: number) {
  try {
    ensureRealDatabasePopulated().catch(() => {});
    const db = getDb();
    const result = await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      displayOrder: schema.menuItems.displayOrder,
      categoryId: schema.menuItems.categoryId,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
      categoryIcon: schema.categories.icon,
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, true)))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
    if (result && result.length > 0) return result;

    if (vendorId === 21) {
      return FOOD_CAVE_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 22) {
      return APNA_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 23) {
      return SURAJ_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 24) {
      return FOOD_POINT_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 25) {
      return HANGRY_CLUB_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 26) {
      return RAHUL_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 27) {
      return EAT_AND_FUN_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 28) {
      return CHEF_ON_FOOD_JUNCTION_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 29) {
      return BAKERS_BITE_KKR_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 30) {
      return ASHU_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 31) {
      return THE_SPICE_CHAMBER_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 32) {
      return CAFE_AROMA_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 33) {
      return ANTY_JI_TEA_STALL_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 34) {
      return AMAN_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 35) {
      return YUMMY_TUMMY_FOODS_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }
    return MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId && m.isAvailable);
  } catch (e) {
    if (vendorId === 21) {
      return FOOD_CAVE_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 22) {
      return APNA_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 23) {
      return SURAJ_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 24) {
      return FOOD_POINT_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 25) {
      return HANGRY_CLUB_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 26) {
      return RAHUL_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 27) {
      return EAT_AND_FUN_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 28) {
      return CHEF_ON_FOOD_JUNCTION_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 29) {
      return BAKERS_BITE_KKR_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 30) {
      return ASHU_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 31) {
      return THE_SPICE_CHAMBER_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 32) {
      return CAFE_AROMA_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 33) {
      return ANTY_JI_TEA_STALL_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 34) {
      return AMAN_FAST_FOOD_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }

    if (vendorId === 35) {
      return YUMMY_TUMMY_FOODS_MENU_ITEMS.map(item => {
        const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
        return {
          ...item,
          image: null,
          categoryName: cat?.name || 'General',
          categorySlug: cat?.slug || 'general',
          categoryIcon: cat?.icon || '🍽️'
        };
      });
    }
    return MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId && m.isAvailable);
  }
}




export async function getMenuItemsWithReviewStats(vendorId: number) {
  try {
    const items = await getMenuItemsByVendor(vendorId);
    const vendorReviews = await getReviewsByVendor(vendorId);

    return items.map((item: any) => {
      const itemReviews = vendorReviews.filter((r: any) => r.menuItemId === item.id);
      const reviewCount = itemReviews.length;
      const avgRating = reviewCount > 0
        ? (itemReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
        : null;
      return {
        ...item,
        avgRating,
        reviewCount,
        recentReviews: itemReviews.slice(0, 5)
      };
    });
  } catch (e) {
    console.error('getMenuItemsWithReviewStats error:', e);
    return [];
  }
}

function fairInterleaveByVendor(items: any[]): any[] {
  if (!items || items.length <= 1) return items;

  const vendorBuckets: Record<string, any[]> = {};
  const vendorKeys: string[] = [];

  for (const item of items) {
    const key = item.vendorSlug || item.vendorName || String(item.vendorId) || 'unknown';
    if (!vendorBuckets[key]) {
      vendorBuckets[key] = [];
      vendorKeys.push(key);
    }
    vendorBuckets[key].push(item);
  }

  // Shuffle individual buckets so different types of food from each vendor surface
  for (const key of vendorKeys) {
    const bucket = vendorBuckets[key];
    for (let i = bucket.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
    }
  }

  // Shuffle vendor order randomly so all vendors get equal first-place distribution
  for (let i = vendorKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vendorKeys[i], vendorKeys[j]] = [vendorKeys[j], vendorKeys[i]];
  }

  const result: any[] = [];
  let added = true;

  while (added) {
    added = false;
    for (const key of vendorKeys) {
      if (vendorBuckets[key] && vendorBuckets[key].length > 0) {
        result.push(vendorBuckets[key].shift());
        added = true;
      }
    }
  }

  return result;
}

export async function getAllMenuItemsForSearch() {
  try {
    const db = getDb();
    let items: any = await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      vendorId: schema.vendors.id,
      vendorName: schema.vendors.name,
      vendorSlug: schema.vendors.slug,
      vendorPhone: schema.vendors.phone,
      vendorWhatsApp: schema.vendors.whatsapp,
      vendorOpensAt: schema.vendors.opensAt,
      vendorClosesAt: schema.vendors.closesAt,
      categoryId: schema.categories.id,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
    })
      .from(schema.menuItems)
      .innerJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.isAvailable, true), eq(schema.vendors.isActive, true)));

    if (items && items.length > 0) {
      const allReviews = await db.select({
        id: schema.reviews.id,
        menuItemId: schema.reviews.menuItemId,
        rating: schema.reviews.rating,
        studentName: schema.reviews.studentName,
        comment: schema.reviews.comment,
        createdAt: schema.reviews.createdAt
      }).from(schema.reviews);

      const reviewStatsMap: Record<number, { count: number; avgRating: string; reviews: any[] }> = {};
      for (const r of (allReviews || [])) {
        if (!r.menuItemId) continue;
        if (!reviewStatsMap[r.menuItemId]) {
          reviewStatsMap[r.menuItemId] = { count: 0, avgRating: '0.0', reviews: [] };
        }
        reviewStatsMap[r.menuItemId].reviews.push(r);
      }
      for (const id in reviewStatsMap) {
        const revs = reviewStatsMap[id].reviews;
        const count = revs.length;
        const avg = (revs.reduce((sum, r) => sum + (r.rating || 0), 0) / count).toFixed(1);
        reviewStatsMap[id].count = count;
        reviewStatsMap[id].avgRating = avg;
      }

      const mapped = items.map((item: any) => {
        const stats = reviewStatsMap[item.id];
        return {
          ...item,
          avgRating: stats ? stats.avgRating : null,
          reviewCount: stats ? stats.count : 0,
          reviews: stats ? stats.reviews : []
        };
      });

      return fairInterleaveByVendor(mapped);
    }

    await ensureRealDatabasePopulated();
    items = await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      vendorId: schema.vendors.id,
      vendorName: schema.vendors.name,
      vendorSlug: schema.vendors.slug,
      vendorPhone: schema.vendors.phone,
      vendorWhatsApp: schema.vendors.whatsapp,
      vendorOpensAt: schema.vendors.opensAt,
      vendorClosesAt: schema.vendors.closesAt,
      categoryId: schema.categories.id,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
    })
      .from(schema.menuItems)
      .innerJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.isAvailable, true), eq(schema.vendors.isActive, true)));

    if (items && items.length > 0) {
      const allReviews = await db.select({
        id: schema.reviews.id,
        menuItemId: schema.reviews.menuItemId,
        rating: schema.reviews.rating,
        studentName: schema.reviews.studentName,
        comment: schema.reviews.comment,
        createdAt: schema.reviews.createdAt
      }).from(schema.reviews);

      const reviewStatsMap: Record<number, { count: number; avgRating: string; reviews: any[] }> = {};
      for (const r of (allReviews || [])) {
        if (!r.menuItemId) continue;
        if (!reviewStatsMap[r.menuItemId]) {
          reviewStatsMap[r.menuItemId] = { count: 0, avgRating: '0.0', reviews: [] };
        }
        reviewStatsMap[r.menuItemId].reviews.push(r);
      }
      for (const id in reviewStatsMap) {
        const revs = reviewStatsMap[id].reviews;
        const count = revs.length;
        const avg = (revs.reduce((sum, r) => sum + (r.rating || 0), 0) / count).toFixed(1);
        reviewStatsMap[id].count = count;
        reviewStatsMap[id].avgRating = avg;
      }

      const mapped = items.map((item: any) => {
        const stats = reviewStatsMap[item.id];
        return {
          ...item,
          avgRating: stats ? stats.avgRating : null,
          reviewCount: stats ? stats.count : 0,
          reviews: stats ? stats.reviews : []
        };
      });

      return fairInterleaveByVendor(mapped);
    }
  } catch (e) {
    console.error('getAllMenuItemsForSearch error:', e);
  }

  const { FOOD_CAVE_MENU_ITEMS, FOOD_CAVE_VENDOR } = await import('./food-cave-data');
  const { APNA_FAST_FOOD_MENU_ITEMS, APNA_FAST_FOOD_VENDOR } = await import('./apna-fast-food-data');
  const { SURAJ_MENU_ITEMS, SURAJ_VENDOR } = await import('./suraj-restaurant-data');
  const { FOOD_POINT_MENU_ITEMS, FOOD_POINT_VENDOR } = await import('./food-point-data');
  const { HANGRY_CLUB_MENU_ITEMS, HANGRY_CLUB_VENDOR } = await import('./hangry-club-data');
  const { RAHUL_FAST_FOOD_MENU_ITEMS, RAHUL_FAST_FOOD_VENDOR } = await import('./rahul-fast-food-data');
  const { EAT_AND_FUN_MENU_ITEMS, EAT_AND_FUN_VENDOR } = await import('./eat-and-fun-data');
  const { CHEF_ON_FOOD_JUNCTION_MENU_ITEMS, CHEF_ON_FOOD_JUNCTION_VENDOR } = await import('./chef-on-food-junction-data');
  const { BAKERS_BITE_KKR_MENU_ITEMS, BAKERS_BITE_KKR_VENDOR } = await import('./bakers-bite-kkr-data');
  const { ASHU_FAST_FOOD_MENU_ITEMS, ASHU_FAST_FOOD_VENDOR } = await import('./ashu-fast-food-data');
  const { THE_SPICE_CHAMBER_MENU_ITEMS, THE_SPICE_CHAMBER_VENDOR } = await import('./the-spice-chamber-data');
  const { CAFE_AROMA_MENU_ITEMS, CAFE_AROMA_VENDOR } = await import('./cafe-aroma-data');
  const { ANTY_JI_TEA_STALL_MENU_ITEMS, ANTY_JI_TEA_STALL_VENDOR } = await import('./anty-ji-tea-stall-data');
  const { AMAN_FAST_FOOD_MENU_ITEMS, AMAN_FAST_FOOD_VENDOR } = await import('./aman-fast-food-data');
  const { YUMMY_TUMMY_FOODS_MENU_ITEMS, YUMMY_TUMMY_FOODS_VENDOR } = await import('./yummy-tummy-foods-data');
  const { MOCK_CATEGORIES } = await import('./mock-data');

  const foodCaveList = FOOD_CAVE_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: FOOD_CAVE_VENDOR.id,
      vendorName: FOOD_CAVE_VENDOR.name,
      vendorSlug: FOOD_CAVE_VENDOR.slug,
      vendorPhone: FOOD_CAVE_VENDOR.phone,
      vendorWhatsApp: FOOD_CAVE_VENDOR.whatsapp,
      vendorOpensAt: FOOD_CAVE_VENDOR.opensAt,
      vendorClosesAt: FOOD_CAVE_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const apnaList = APNA_FAST_FOOD_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: APNA_FAST_FOOD_VENDOR.id,
      vendorName: APNA_FAST_FOOD_VENDOR.name,
      vendorSlug: APNA_FAST_FOOD_VENDOR.slug,
      vendorPhone: APNA_FAST_FOOD_VENDOR.phone,
      vendorWhatsApp: APNA_FAST_FOOD_VENDOR.whatsapp,
      vendorOpensAt: APNA_FAST_FOOD_VENDOR.opensAt,
      vendorClosesAt: APNA_FAST_FOOD_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const surajList = SURAJ_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: SURAJ_VENDOR.id,
      vendorName: SURAJ_VENDOR.name,
      vendorSlug: SURAJ_VENDOR.slug,
      vendorPhone: SURAJ_VENDOR.phone,
      vendorWhatsApp: SURAJ_VENDOR.whatsapp,
      vendorOpensAt: SURAJ_VENDOR.opensAt,
      vendorClosesAt: SURAJ_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const foodPointList = FOOD_POINT_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: FOOD_POINT_VENDOR.id,
      vendorName: FOOD_POINT_VENDOR.name,
      vendorSlug: FOOD_POINT_VENDOR.slug,
      vendorPhone: FOOD_POINT_VENDOR.phone,
      vendorWhatsApp: FOOD_POINT_VENDOR.whatsapp,
      vendorOpensAt: FOOD_POINT_VENDOR.opensAt,
      vendorClosesAt: FOOD_POINT_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const hangryClubList = HANGRY_CLUB_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: HANGRY_CLUB_VENDOR.id,
      vendorName: HANGRY_CLUB_VENDOR.name,
      vendorSlug: HANGRY_CLUB_VENDOR.slug,
      vendorPhone: HANGRY_CLUB_VENDOR.phone,
      vendorWhatsApp: HANGRY_CLUB_VENDOR.whatsapp,
      vendorOpensAt: HANGRY_CLUB_VENDOR.opensAt,
      vendorClosesAt: HANGRY_CLUB_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const rahulList = RAHUL_FAST_FOOD_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: RAHUL_FAST_FOOD_VENDOR.id,
      vendorName: RAHUL_FAST_FOOD_VENDOR.name,
      vendorSlug: RAHUL_FAST_FOOD_VENDOR.slug,
      vendorPhone: RAHUL_FAST_FOOD_VENDOR.phone,
      vendorWhatsApp: RAHUL_FAST_FOOD_VENDOR.whatsapp,
      vendorOpensAt: RAHUL_FAST_FOOD_VENDOR.opensAt,
      vendorClosesAt: RAHUL_FAST_FOOD_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const eatAndFunList = EAT_AND_FUN_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: EAT_AND_FUN_VENDOR.id,
      vendorName: EAT_AND_FUN_VENDOR.name,
      vendorSlug: EAT_AND_FUN_VENDOR.slug,
      vendorPhone: EAT_AND_FUN_VENDOR.phone,
      vendorWhatsApp: EAT_AND_FUN_VENDOR.whatsapp,
      vendorOpensAt: EAT_AND_FUN_VENDOR.opensAt,
      vendorClosesAt: EAT_AND_FUN_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const chefOnList = CHEF_ON_FOOD_JUNCTION_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: CHEF_ON_FOOD_JUNCTION_VENDOR.id,
      vendorName: CHEF_ON_FOOD_JUNCTION_VENDOR.name,
      vendorSlug: CHEF_ON_FOOD_JUNCTION_VENDOR.slug,
      vendorPhone: CHEF_ON_FOOD_JUNCTION_VENDOR.phone,
      vendorWhatsApp: CHEF_ON_FOOD_JUNCTION_VENDOR.whatsapp,
      vendorOpensAt: CHEF_ON_FOOD_JUNCTION_VENDOR.opensAt,
      vendorClosesAt: CHEF_ON_FOOD_JUNCTION_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const bakersBiteList = BAKERS_BITE_KKR_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: BAKERS_BITE_KKR_VENDOR.id,
      vendorName: BAKERS_BITE_KKR_VENDOR.name,
      vendorSlug: BAKERS_BITE_KKR_VENDOR.slug,
      vendorPhone: BAKERS_BITE_KKR_VENDOR.phone,
      vendorWhatsApp: BAKERS_BITE_KKR_VENDOR.whatsapp,
      vendorOpensAt: BAKERS_BITE_KKR_VENDOR.opensAt,
      vendorClosesAt: BAKERS_BITE_KKR_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const ashuList = ASHU_FAST_FOOD_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: ASHU_FAST_FOOD_VENDOR.id,
      vendorName: ASHU_FAST_FOOD_VENDOR.name,
      vendorSlug: ASHU_FAST_FOOD_VENDOR.slug,
      vendorPhone: ASHU_FAST_FOOD_VENDOR.phone,
      vendorWhatsApp: ASHU_FAST_FOOD_VENDOR.whatsapp,
      vendorOpensAt: ASHU_FAST_FOOD_VENDOR.opensAt,
      vendorClosesAt: ASHU_FAST_FOOD_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const spiceChamberList = THE_SPICE_CHAMBER_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: THE_SPICE_CHAMBER_VENDOR.id,
      vendorName: THE_SPICE_CHAMBER_VENDOR.name,
      vendorSlug: THE_SPICE_CHAMBER_VENDOR.slug,
      vendorPhone: THE_SPICE_CHAMBER_VENDOR.phone,
      vendorWhatsApp: THE_SPICE_CHAMBER_VENDOR.whatsapp,
      vendorOpensAt: THE_SPICE_CHAMBER_VENDOR.opensAt,
      vendorClosesAt: THE_SPICE_CHAMBER_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const cafeAromaList = CAFE_AROMA_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: CAFE_AROMA_VENDOR.id,
      vendorName: CAFE_AROMA_VENDOR.name,
      vendorSlug: CAFE_AROMA_VENDOR.slug,
      vendorPhone: CAFE_AROMA_VENDOR.phone,
      vendorWhatsApp: CAFE_AROMA_VENDOR.whatsapp,
      vendorOpensAt: CAFE_AROMA_VENDOR.opensAt,
      vendorClosesAt: CAFE_AROMA_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const antyJiList = ANTY_JI_TEA_STALL_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: ANTY_JI_TEA_STALL_VENDOR.id,
      vendorName: ANTY_JI_TEA_STALL_VENDOR.name,
      vendorSlug: ANTY_JI_TEA_STALL_VENDOR.slug,
      vendorPhone: ANTY_JI_TEA_STALL_VENDOR.phone,
      vendorWhatsApp: ANTY_JI_TEA_STALL_VENDOR.whatsapp,
      vendorOpensAt: ANTY_JI_TEA_STALL_VENDOR.opensAt,
      vendorClosesAt: ANTY_JI_TEA_STALL_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const amanList = AMAN_FAST_FOOD_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: AMAN_FAST_FOOD_VENDOR.id,
      vendorName: AMAN_FAST_FOOD_VENDOR.name,
      vendorSlug: AMAN_FAST_FOOD_VENDOR.slug,
      vendorPhone: AMAN_FAST_FOOD_VENDOR.phone,
      vendorWhatsApp: AMAN_FAST_FOOD_VENDOR.whatsapp,
      vendorOpensAt: AMAN_FAST_FOOD_VENDOR.opensAt,
      vendorClosesAt: AMAN_FAST_FOOD_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  const yummyTummyList = YUMMY_TUMMY_FOODS_MENU_ITEMS.map((item: any) => {
    const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: (item as any).image || null,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      tags: item.tags || [],
      vendorId: YUMMY_TUMMY_FOODS_VENDOR.id,
      vendorName: YUMMY_TUMMY_FOODS_VENDOR.name,
      vendorSlug: YUMMY_TUMMY_FOODS_VENDOR.slug,
      vendorPhone: YUMMY_TUMMY_FOODS_VENDOR.phone,
      vendorWhatsApp: YUMMY_TUMMY_FOODS_VENDOR.whatsapp,
      vendorOpensAt: YUMMY_TUMMY_FOODS_VENDOR.opensAt,
      vendorClosesAt: YUMMY_TUMMY_FOODS_VENDOR.closesAt,
      categoryId: item.categoryId,
      categoryName: cat?.name || 'General',
      categorySlug: cat?.slug || 'general',
    };
  });

  return fairInterleaveByVendor([
    ...foodCaveList, 
    ...apnaList, 
    ...surajList,
    ...foodPointList,
    ...hangryClubList,
    ...rahulList,
    ...eatAndFunList,
    ...chefOnList,
    ...bakersBiteList,
    ...ashuList,
    ...spiceChamberList,
    ...cafeAromaList,
    ...antyJiList,
    ...amanList,
    ...yummyTummyList
  ]);
}


export function isVendorOpenNow(opensAt?: string, closesAt?: string): boolean {
  if (!opensAt || !closesAt) return true;
  try {
    const now = new Date();
    // Convert UTC to Indian Standard Time (UTC+5:30) with pure arithmetic
    const utcMinutesTotal = now.getUTCHours() * 60 + now.getUTCMinutes() + 330;
    const istMinutesTotal = (utcMinutesTotal % 1440 + 1440) % 1440;
    const istHours = Math.floor(istMinutesTotal / 60);
    const istMins = istMinutesTotal % 60;
    const istTime = `${String(istHours).padStart(2, '0')}:${String(istMins).padStart(2, '0')}`;

    if (opensAt > closesAt) {
      return istTime >= opensAt || istTime <= closesAt;
    }
    return istTime >= opensAt && istTime <= closesAt;
  } catch (e) {
    return true;
  }
}


export async function getMinPrice(vendorId: number): Promise<number | null> {
  try {
    const db = getDb();
    const result = await db.select({ minPrice: sql<number>`min(${schema.menuItems.price})` })
      .from(schema.menuItems)
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, true)));
    return result[0]?.minPrice ?? null;
  } catch (e) {
    return null;
  }
}

export async function getAllMinPricesByVendor(): Promise<Record<number, number>> {
  try {
    const db = getDb();
    const results = await db.select({
      vendorId: schema.menuItems.vendorId,
      minPrice: sql<number>`min(${schema.menuItems.price})`
    })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.isAvailable, true))
      .groupBy(schema.menuItems.vendorId);

    const map: Record<number, number> = {};
    for (const r of results) {
      if (r.vendorId && r.minPrice) {
        map[r.vendorId] = r.minPrice;
      }
    }
    return map;
  } catch (e) {
    return {};
  }
}


export async function getAllMenuItemsByVendor(vendorId: number) {
  try {
    const db = getDb();
    return await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      displayOrder: schema.menuItems.displayOrder,
      categoryId: schema.menuItems.categoryId,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
      categoryIcon: schema.categories.icon,
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(eq(schema.menuItems.vendorId, vendorId))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
  } catch (e) {
    return [];
  }
}

export async function createMenuItem(data: {
  vendorId: number;
  categoryId?: number | null;
  name: string;
  description?: string | null;
  price: string | number;
  image?: string | null;
  isVeg?: boolean;
  isAvailable?: boolean;
  tags?: string[];
  displayOrder?: number;
}) {
  try {
    const db = createDb();
    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.menuItems.displayOrder})` })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.vendorId, data.vendorId));
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [item] = await db.insert(schema.menuItems).values({
      vendorId: data.vendorId,
      categoryId: data.categoryId || null,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      price: parseFloat(String(data.price)),
      image: data.image?.trim() || null,
      isVeg: data.isVeg ?? true,
      isAvailable: data.isAvailable ?? true,
      tags: data.tags || [],
      displayOrder: data.displayOrder ?? nextOrder,
    } as any).returning();
    return item;
  } catch (error) {
    console.error('Create menu item error:', error);
    throw error;
  }
}

export async function updateMenuItem(id: number, data: Partial<{
  categoryId: number | null;
  name: string;
  description: string | null;
  price: string | number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  tags: string[];
  displayOrder: number;
}>) {
  try {
    const db = createDb();
    const updateData: Record<string, any> = {};
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.name) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.price !== undefined) updateData.price = parseFloat(String(data.price));
    if (data.image !== undefined) updateData.image = data.image?.trim() || null;
    if (data.isVeg !== undefined) updateData.isVeg = Boolean(data.isVeg);
    if (data.isAvailable !== undefined) updateData.isAvailable = Boolean(data.isAvailable);
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

    if (Object.keys(updateData).length === 0) return null;

    const [item] = await db.update(schema.menuItems)
      .set(updateData)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return item;
  } catch (error) {
    console.error('Update menu item error:', error);
    throw error;
  }
}

export async function deleteMenuItem(id: number) {
  try {
    const db = createDb();
    await db.delete(schema.menuItems)
      .where(eq(schema.menuItems.id, id));
    return true;
  } catch (error) {
    console.error('Delete menu item error:', error);
    throw error;
  }
}

export async function createReview(data: {
  menuItemId: number;
  studentName: string;
  rating: number;
  comment?: string;
}, dbInstance?: any) {
  try {
    const db = dbInstance || createDb();
    const result = await db.insert(schema.reviews).values({
      menuItemId: data.menuItemId,
      studentName: data.studentName.trim(),
      rating: data.rating,
      comment: data.comment?.trim() || null,
    } as any).returning();
    if (Array.isArray(result) && result.length > 0) return result[0];
    return result || {
      id: Date.now(),
      menuItemId: data.menuItemId,
      studentName: data.studentName.trim(),
      rating: data.rating,
      comment: data.comment?.trim() || null,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Create review error:', error);
    return {
      id: Date.now(),
      menuItemId: data.menuItemId,
      studentName: data.studentName.trim(),
      rating: data.rating,
      comment: data.comment?.trim() || null,
      createdAt: new Date().toISOString()
    };
  }
}



export async function getReviewsByMenuItem(menuItemId: number) {
  try {
    const db = createDb();
    const result = await db.select()
      .from(schema.reviews)
      .where(eq(schema.reviews.menuItemId, menuItemId))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
    return isDev ? MOCK_REVIEWS.filter(r => r.menuItemId === menuItemId) : [];
  } catch (e) {
    return isDev ? MOCK_REVIEWS.filter(r => r.menuItemId === menuItemId) : [];
  }
}

export async function getReviewsByVendor(vendorId: number) {
  try {
    const db = createDb();
    const result = await db.select({
      id: schema.reviews.id,
      menuItemId: schema.reviews.menuItemId,
      studentName: schema.reviews.studentName,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      menuItemName: schema.menuItems.name,
    })
      .from(schema.reviews)
      .innerJoin(schema.menuItems, eq(schema.reviews.menuItemId, schema.menuItems.id))
      .where(eq(schema.menuItems.vendorId, vendorId))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
  } catch (e) {
    // fallback
  }

  if (!isDev) return [];

  const vendorItemIds = MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId).map(m => m.id);
  return MOCK_REVIEWS.filter(r => vendorItemIds.includes(r.menuItemId)).map(r => {
    const item = MOCK_MENU_ITEMS.find(m => m.id === r.menuItemId);
    return {
      ...r,
      menuItemName: item?.name || 'Dish',
    };
  });
}

export async function getAllReviews() {
  try {
    const db = createDb();
    const result = await db.select({
      id: schema.reviews.id,
      menuItemId: schema.reviews.menuItemId,
      studentName: schema.reviews.studentName,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      menuItemName: schema.menuItems.name,
      vendorName: schema.vendors.name,
    })
      .from(schema.reviews)
      .leftJoin(schema.menuItems, eq(schema.reviews.menuItemId, schema.menuItems.id))
      .leftJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
  } catch (e) {
    // fallback
  }

  if (!isDev) return [];

  return MOCK_REVIEWS.map(r => {
    const item = MOCK_MENU_ITEMS.find(m => m.id === r.menuItemId);
    const vendor = item ? MOCK_VENDORS.find(v => v.id === item.vendorId) : null;
    return {
      ...r,
      menuItemName: item?.name || 'Dish',
      vendorName: vendor?.name || 'Campus Stall',
    };
  });
}



export async function deleteReview(id: number) {
  try {
    const db = createDb();
    await db.delete(schema.reviews)
      .where(eq(schema.reviews.id, id));
    return true;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const db = createDb();
    const result = await db.select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, key))
      .limit(1);
    return result[0]?.value || null;
  } catch (e) {
    return null;
  }
}

export async function setSiteSetting(key: string, value: string) {
  try {
    const db = createDb();
    await db.insert(schema.siteSettings).values({ key, value })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value } });
    return true;
  } catch (error) {
    console.error('Set site setting error:', error);
    throw error;
  }
}

export async function getAllSiteSettings() {
  try {
    const db = createDb();
    return await db.select()
      .from(schema.siteSettings);
  } catch (e) {
    return [];
  }
}