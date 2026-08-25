import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq } from 'drizzle-orm';
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

export const GET: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const [item] = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id)).limit(1);
    if (!item) {
      return new Response(JSON.stringify({ error: 'Menu item not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ item }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get menu item' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = body;

    const updateData: Record<string, any> = {};
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (name?.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (price !== undefined && price !== '') updateData.price = parseFloat(price);
    if (image !== undefined) updateData.image = image?.trim() || null;
    if (isVeg !== undefined) updateData.isVeg = Boolean(isVeg);
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);
    if (tags !== undefined) updateData.tags = tags;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const [item] = await db.update(schema.menuItems).set(updateData).where(eq(schema.menuItems.id, id)).returning();
    if (!item) {
      return new Response(JSON.stringify({ error: 'Menu item not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
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

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid menu item ID' }), {
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