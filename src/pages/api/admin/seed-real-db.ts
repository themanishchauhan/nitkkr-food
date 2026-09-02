import type { APIRoute } from 'astro';
import { createDb, getRawD1Binding, schema } from '../../../lib/db';
import { FOOD_CAVE_VENDOR, FOOD_CAVE_MENU_ITEMS } from '../../../lib/food-cave-data';
import { APNA_FAST_FOOD_VENDOR, APNA_FAST_FOOD_MENU_ITEMS } from '../../../lib/apna-fast-food-data';
import { SURAJ_VENDOR, SURAJ_MENU_ITEMS } from '../../../lib/suraj-restaurant-data';
import { FOOD_POINT_VENDOR, FOOD_POINT_MENU_ITEMS } from '../../../lib/food-point-data';
import { HANGRY_CLUB_VENDOR, HANGRY_CLUB_MENU_ITEMS } from '../../../lib/hangry-club-data';
import { MOCK_CATEGORIES } from '../../../lib/mock-data';

export const prerender = false;

export const POST: APIRoute = async ({ locals }) => {
  try {
    const d1 = (locals as any)?.db || getRawD1Binding();
    if (!d1 || typeof d1.prepare !== 'function') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'D1 binding not directly attached, fallback & static resolution active for all campus vendors.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert categories
    for (const cat of MOCK_CATEGORIES) {
      await d1.prepare(`
        INSERT OR IGNORE INTO categories (id, name, slug, icon, display_order)
        VALUES (?, ?, ?, ?, ?)
      `).bind(cat.id, cat.name, cat.slug, cat.icon, cat.displayOrder).run();
    }

    const vendorsToSeed = [
      FOOD_CAVE_VENDOR, 
      APNA_FAST_FOOD_VENDOR, 
      SURAJ_VENDOR,
      FOOD_POINT_VENDOR,
      HANGRY_CLUB_VENDOR
    ];
    for (const vendor of vendorsToSeed) {
      await d1.prepare(`
        INSERT OR REPLACE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
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
    }

    // Batch insert menu items
    const allMenuItems = [
      ...FOOD_CAVE_MENU_ITEMS, 
      ...APNA_FAST_FOOD_MENU_ITEMS, 
      ...SURAJ_MENU_ITEMS,
      ...FOOD_POINT_MENU_ITEMS,
      ...HANGRY_CLUB_MENU_ITEMS
    ];
    const statements: any[] = [];
    for (const item of allMenuItems) {
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

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully seeded Food Cave & Apna Fresh Fast Food with all ${allMenuItems.length} dishes into Real Database!` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Seed real db error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to seed real db' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
