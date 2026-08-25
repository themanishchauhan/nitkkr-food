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

export const PATCH: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getDb();
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid category ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { name, icon, slug, displayOrder } = body;

    const updateData: Record<string, any> = {};
    if (name?.trim()) updateData.name = name.trim();
    if (icon?.trim()) updateData.icon = icon.trim();
    if (slug?.trim()) updateData.slug = slug.trim();
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [category] = await db.update(schema.categories)
      .set(updateData)
      .where(eq(schema.categories.id, id))
      .returning();

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, category }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid category ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getDb();
    await db.delete(schema.categories)
      .where(eq(schema.categories.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};