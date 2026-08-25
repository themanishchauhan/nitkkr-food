import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq, asc, sql } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const GET: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    const categories = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    return new Response(JSON.stringify({ categories: categories || [] }), {
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
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    const body = await request.json();
    const { name, icon, displayOrder } = body;

    if (!name?.trim()) {
      return new Response(JSON.stringify({ error: 'Category name is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = slugify(name);
    const [category] = await db.insert(schema.categories).values({
      name: name.trim(),
      slug,
      icon: icon?.trim() || '🍽️',
      displayOrder: displayOrder ? Number(displayOrder) : 0,
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
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    const body = await request.json();
    const { id, name, icon, displayOrder } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Category ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates: any = {};
    if (name !== undefined) {
      updates.name = name.trim();
      updates.slug = slugify(name);
    }
    if (icon !== undefined) updates.icon = icon.trim();
    if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);

    const [category] = await db.update(schema.categories).set(updates).where(eq(schema.categories.id, Number(id))).returning();

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
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const idParam = url.searchParams.get('id');
    if (!idParam) {
      return new Response(JSON.stringify({ error: 'Category ID required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = createDb();
    const catId = parseInt(idParam, 10);
    await db.delete(schema.categories).where(eq(schema.categories.id, catId));

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