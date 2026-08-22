import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../../lib/db';
import { eq } from 'drizzle-orm';

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
    return getDb(env?.DB);
  } catch (e) {
    return getDb();
  }
}

export const GET: APIRoute = async (context) => {
  const { request, params } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(context);
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [item] = await db.select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id))
      .limit(1);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Menu item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ item }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get menu item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async (context) => {
  const { request, params } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(context);
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = body;

    const updateData: Record<string, any> = {};
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (name?.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (price !== undefined && price !== '') updateData.price = price.toString();
    if (image !== undefined) updateData.image = image?.trim() || null;
    if (isVeg !== undefined) updateData.isVeg = isVeg ? 1 : 0;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable ? 1 : 0;
    if (tags !== undefined) updateData.tags = tags;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [item] = await db.update(schema.menuItems)
      .set(updateData)
      .where(eq(schema.menuItems.id, id))
      .returning();

    if (!item) {
      return new Response(JSON.stringify({ error: 'Menu item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, item }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  const { request, params } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(context);
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.delete(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete menu item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};