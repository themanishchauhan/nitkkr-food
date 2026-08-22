import type { APIRoute } from 'astro';
import { getDbFromEnv, schema } from '../../../../lib/db';
import { getMenuItemsByVendor } from '../../../../lib/queries';
import { eq, asc, sql } from 'drizzle-orm';

export const prerender = false;

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET || '';

function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-key');
  if (!ADMIN_SECRET || ADMIN_SECRET.length === 0) {
    return true;
  }
  return authHeader === ADMIN_SECRET;
}

function getD1Db(context: any) {
  const env = context?.locals?.runtime?.env || context?.request?.env || (globalThis as any).env;
  try {
    return getDbFromEnv(env?.DB);
  } catch (e) {
    return null;
  }
}

export const GET: APIRoute = async (context) => {
  const { request, url } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const vendorIdParam = url.searchParams.get('vendorId');
    if (!vendorIdParam) {
      return new Response(JSON.stringify({ error: 'vendorId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const vendorId = parseInt(vendorIdParam, 10);
    if (!vendorId || isNaN(vendorId)) {
      return new Response(JSON.stringify({ error: 'Invalid vendorId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getD1Db(context);
    if (db) {
      const items = await db.select({
        id: schema.menuItems.id,
        vendorId: schema.menuItems.vendorId,
        categoryId: schema.menuItems.categoryId,
        name: schema.menuItems.name,
        description: schema.menuItems.description,
        price: schema.menuItems.price,
        image: schema.menuItems.image,
        isVeg: schema.menuItems.isVeg,
        isAvailable: schema.menuItems.isAvailable,
        tags: schema.menuItems.tags,
        displayOrder: schema.menuItems.displayOrder,
        createdAt: schema.menuItems.createdAt,
        categoryName: schema.categories.name,
        categorySlug: schema.categories.slug,
        categoryIcon: schema.categories.icon,
      })
        .from(schema.menuItems)
        .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
        .where(eq(schema.menuItems.vendorId, vendorId))
        .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));

      if (items && items.length > 0) {
        return new Response(JSON.stringify({ items }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const fallbackItems = await getMenuItemsByVendor(vendorId);
    return new Response(JSON.stringify({ items: fallbackItems }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List menu items error:', error);
    const fallbackItems = await getMenuItemsByVendor(1);
    return new Response(JSON.stringify({ items: fallbackItems }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async (context) => {
  const { request } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { vendorId, categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = body;

    if (!vendorId || !name?.trim() || price === undefined || price === '') {
      return new Response(JSON.stringify({ error: 'Missing required fields: vendorId, name, price' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getD1Db(context);
    if (!db) {
      return new Response(JSON.stringify({ success: true, item: { id: Date.now(), ...body } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.menuItems.displayOrder})` })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.vendorId, vendorId));
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [item] = await db.insert(schema.menuItems).values({
      vendorId,
      categoryId: categoryId || null,
      name: name.trim(),
      description: description?.trim() || null,
      price: price.toString(),
      image: image?.trim() || null,
      isVeg: isVeg ?? true,
      isAvailable: isAvailable ?? true,
      tags: tags || [],
      displayOrder: displayOrder ?? nextOrder,
    } as any).returning();

    return new Response(JSON.stringify({ success: true, item }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create menu item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};