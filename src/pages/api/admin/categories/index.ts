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
    let categories = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    
    if (!categories || categories.length === 0) {
      const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
      await ensureRealDatabasePopulated();
      categories = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    }

    if (!categories || categories.length === 0) {
      const { MOCK_CATEGORIES } = await import('../../../../lib/mock-data');
      categories = MOCK_CATEGORIES as any;
    }

    return new Response(JSON.stringify({ categories: categories || [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List categories error:', error);
    const { MOCK_CATEGORIES } = await import('../../../../lib/mock-data');
    return new Response(JSON.stringify({ categories: MOCK_CATEGORIES as any }), {
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
    const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
    await ensureRealDatabasePopulated();

    const db = createDb();
    const body = await request.json();
    const { name, icon, displayOrder } = body;

    if (!name?.trim()) {
      return new Response(JSON.stringify({ error: 'Category name is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = slugify(name);
    const rawD1 = (await import('../../../../lib/db')).getRawD1Binding();
    if (rawD1 && typeof rawD1.prepare === 'function') {
      try {
        await rawD1.prepare(`
          INSERT INTO categories (name, slug, icon, display_order)
          VALUES (?, ?, ?, ?)
        `).bind(name.trim(), slug, icon?.trim() || '🍽️', displayOrder ? Number(displayOrder) : 0).run();

        const inserted = await rawD1.prepare(`SELECT * FROM categories WHERE slug = ? LIMIT 1`).bind(slug).first();
        return new Response(JSON.stringify({ success: true, category: inserted }), {
          status: 201, headers: { 'Content-Type': 'application/json' },
        });
      } catch (rawErr) {
        console.warn('Raw D1 insert category error, falling back to Drizzle:', rawErr);
      }
    }

    const [category] = await db.insert(schema.categories).values({
      name: name.trim(),
      slug,
      icon: icon?.trim() || '🍽️',
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    }).returning();

    return new Response(JSON.stringify({ success: true, category }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to create category' }), {
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
    const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
    await ensureRealDatabasePopulated();

    const db = createDb();
    const body = await request.json();
    const { id, name, icon, displayOrder } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Category ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const catId = Number(id);
    const updates: any = {};
    if (name !== undefined) {
      updates.name = name.trim();
      updates.slug = slugify(name);
    }
    if (icon !== undefined) updates.icon = icon.trim();
    if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);

    const rawD1 = (await import('../../../../lib/db')).getRawD1Binding();
    if (rawD1 && typeof rawD1.prepare === 'function') {
      try {
        await rawD1.prepare(`
          UPDATE categories SET
            name = COALESCE(?, name),
            slug = COALESCE(?, slug),
            icon = COALESCE(?, icon),
            display_order = COALESCE(?, display_order)
          WHERE id = ?
        `).bind(
          updates.name !== undefined ? updates.name : null,
          updates.slug !== undefined ? updates.slug : null,
          updates.icon !== undefined ? updates.icon : null,
          updates.displayOrder !== undefined ? updates.displayOrder : null,
          catId
        ).run();

        const saved = await rawD1.prepare(`SELECT * FROM categories WHERE id = ? LIMIT 1`).bind(catId).first();
        return new Response(JSON.stringify({ success: true, category: saved || updates }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      } catch (rawErr) {
        console.warn('Raw D1 update category error, falling back to Drizzle:', rawErr);
      }
    }

    const [category] = await db.update(schema.categories).set(updates).where(eq(schema.categories.id, catId)).returning();

    return new Response(JSON.stringify({ success: true, category: category || updates }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to update category' }), {
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