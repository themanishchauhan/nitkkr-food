import type { APIRoute } from 'astro';
import { createDb, getRawD1Binding, schema } from '../../../lib/db';
import { FOOD_CAVE_VENDOR, FOOD_CAVE_MENU_ITEMS } from '../../../lib/food-cave-data';
import { MOCK_CATEGORIES } from '../../../lib/mock-data';

export const prerender = false;

export const POST: APIRoute = async ({ locals }) => {
  try {
    const d1 = (locals as any)?.runtime?.env?.DB || getRawD1Binding();
    if (!d1 || typeof d1.prepare !== 'function') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'D1 binding not directly attached, fallback & static resolution active for Food Cave (172 dishes).' 
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

    // Insert Food Cave
    await d1.prepare(`
      INSERT OR REPLACE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      FOOD_CAVE_VENDOR.id,
      FOOD_CAVE_VENDOR.name,
      FOOD_CAVE_VENDOR.slug,
      FOOD_CAVE_VENDOR.phone,
      FOOD_CAVE_VENDOR.whatsapp,
      FOOD_CAVE_VENDOR.address,
      FOOD_CAVE_VENDOR.latitude,
      FOOD_CAVE_VENDOR.longitude,
      FOOD_CAVE_VENDOR.opensAt,
      FOOD_CAVE_VENDOR.closesAt,
      JSON.stringify(FOOD_CAVE_VENDOR.deliversTo),
      FOOD_CAVE_VENDOR.image,
      FOOD_CAVE_VENDOR.isActive ? 1 : 0,
      FOOD_CAVE_VENDOR.isFeatured ? 1 : 0,
      FOOD_CAVE_VENDOR.displayOrder
    ).run();

    // Batch insert menu items
    const statements: any[] = [];
    for (const item of FOOD_CAVE_MENU_ITEMS) {
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
      message: `Successfully seeded Food Cave Fast Food with all ${FOOD_CAVE_MENU_ITEMS.length} dishes into Real Database!` 
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
