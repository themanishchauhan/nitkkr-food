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
    const db = getDb();
    const idParam = url.searchParams.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!id || isNaN(id)) {
        return new Response(JSON.stringify({ error: 'Invalid category ID' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
      const [category] = await db.select().from(schema.categories).where(eq(schema.categories.id, id)).limit(1);
      if (!category) {
        return new Response(JSON.stringify({ error: 'Category not found' }), {
          status: 404, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ category }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    const categories = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    return new Response(JSON.stringify({ categories }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List categories error:', error);
    return new Response(JSON.stringify({ categories: [] }), {
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
    const { name, icon } = body;
    if (!name?.trim() || !icon?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, icon' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await db.select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.slug, slug)).limit(1);
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'Category slug already exists' }), {
        status: 409, headers: { 'Content-Type': 'application/json' },
      });
    }
    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.categories.displayOrder})` }).from(schema.categories);
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [category] = await db.insert(schema.categories).values({
      name: name.trim(),
      slug,
      icon: icon.trim(),
      displayOrder: nextOrder,
    }).returning();

    return new Response(JSON.stringify({ success: true, category }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create category' }), {
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
    const { id, name, icon, displayOrder } = body;
    if (!id || isNaN(parseInt(id, 10))) {
      return new Response(JSON.stringify({ error: 'Invalid category ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const categoryId = parseInt(id, 10);
    const updateData: Record<string, any> = {};
    if (name?.trim()) updateData.name = name.trim();
    if (icon?.trim()) updateData.icon = icon.trim();
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const [category] = await db.update(schema.categories).set(updateData).where(eq(schema.categories.id, categoryId)).returning();
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true, category }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
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
      return new Response(JSON.stringify({ error: 'Invalid category ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};