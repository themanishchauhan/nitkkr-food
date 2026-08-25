import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq, asc, sql } from 'drizzle-orm';
import { verifySessionToken } from '../../../../lib/auth';

export const prerender = false;

async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  const session = await verifySessionToken(match[1]);
  return !!session;
}

function getDb() {
  return createDb();
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const vendorIdParam = url.searchParams.get('vendorId');
    if (!vendorIdParam) {
      return new Response(JSON.stringify({ error: 'vendorId required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const vendorId = parseInt(vendorIdParam, 10);
    if (!vendorId || isNaN(vendorId)) {
      return new Response(JSON.stringify({ error: 'Invalid vendorId' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = getDb();
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
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(eq(schema.menuItems.vendorId, vendorId))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));

    return new Response(JSON.stringify({ items }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List menu items error:', error);
    return new Response(JSON.stringify({ items: [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const body = await request.json();
    const { vendorId, categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = body;

    if (!vendorId || !name?.trim() || price === undefined || price === '') {
      return new Response(JSON.stringify({ error: 'Missing required fields: vendorId, name, price' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
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
      price: parseFloat(price),
      image: image?.trim() || null,
      isVeg: isVeg ?? true,
      isAvailable: isAvailable ?? true,
      tags: tags || [],
      displayOrder: displayOrder ?? nextOrder,
    } as any).returning();

    return new Response(JSON.stringify({ success: true, item }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create menu item' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const body = await request.json();
    const { id, name, description, price, image, isVeg, isAvailable, categoryId, displayOrder } = body;

    if (!id || isNaN(parseInt(id, 10))) {
      return new Response(JSON.stringify({ error: 'Valid dish ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const itemId = parseInt(id, 10);
    const updateData: Record<string, any> = {};
    if (name?.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (price !== undefined && price !== '') updateData.price = parseFloat(price);
    if (image !== undefined) updateData.image = image?.trim() || null;
    if (isVeg !== undefined) updateData.isVeg = !!isVeg;
    if (isAvailable !== undefined) updateData.isAvailable = !!isAvailable;
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId, 10) : null;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder, 10);

    const [item] = await db.update(schema.menuItems)
      .set(updateData)
      .where(eq(schema.menuItems.id, itemId))
      .returning();

    return new Response(JSON.stringify({ success: true, item }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu item' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const idParam = url.searchParams.get('id');
    const id = parseInt(idParam || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Valid dish ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete menu item' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};