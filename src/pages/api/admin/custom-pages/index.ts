import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

async function ensureCustomPagesTable() {
  try {
    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;
    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare(`
        CREATE TABLE IF NOT EXISTS custom_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          category TEXT DEFAULT 'Explore' NOT NULL,
          icon TEXT DEFAULT '📄' NOT NULL,
          content TEXT NOT NULL,
          show_in_footer INTEGER DEFAULT 1 NOT NULL,
          is_published INTEGER DEFAULT 1 NOT NULL,
          display_order INTEGER DEFAULT 0 NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `).run();
    }
  } catch (e) {
    console.error('Error ensuring custom_pages table in D1:', e);
  }
}

// GET /api/admin/custom-pages - List all custom pages
export const GET: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureCustomPagesTable();
    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;

    let pages: any[] = [];
    if (rawD1 && typeof rawD1.prepare === 'function') {
      const res = await rawD1.prepare('SELECT * FROM custom_pages ORDER BY display_order ASC, id DESC').all();
      pages = (res?.results || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        icon: p.icon,
        content: p.content,
        showInFooter: Boolean(p.show_in_footer),
        isPublished: Boolean(p.is_published),
        displayOrder: p.display_order,
        createdAt: p.created_at
      }));
    }

    return new Response(JSON.stringify({ pages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching custom pages:', error);
    return new Response(JSON.stringify({ pages: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/admin/custom-pages - Create a new custom page
export const POST: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureCustomPagesTable();
    const body = await request.json();
    const { title, slug, category, icon, content, showInFooter, isPublished, displayOrder } = body;

    if (!title?.trim() || !content?.trim()) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;

    if (rawD1 && typeof rawD1.prepare === 'function') {
      const res = await rawD1.prepare(`
        INSERT INTO custom_pages (title, slug, category, icon, content, show_in_footer, is_published, display_order)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      `).bind(
        title.trim(),
        cleanSlug,
        category || 'Explore',
        icon || '📄',
        content,
        showInFooter !== false ? 1 : 0,
        isPublished !== false ? 1 : 0,
        displayOrder || 0
      ).run();

      return new Response(JSON.stringify({ success: true, id: res?.meta?.last_row_id, slug: cleanSlug }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, slug: cleanSlug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create custom page error:', error);
    const msg = error?.message?.includes('UNIQUE') ? 'A page with this URL slug already exists' : 'Failed to create page';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PATCH /api/admin/custom-pages - Update an existing page
export const PATCH: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureCustomPagesTable();
    const body = await request.json();
    const { id, title, slug, category, icon, content, showInFooter, isPublished, displayOrder } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Page ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : undefined;

    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;

    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare(`
        UPDATE custom_pages 
        SET title = COALESCE(?1, title),
            slug = COALESCE(?2, slug),
            category = COALESCE(?3, category),
            icon = COALESCE(?4, icon),
            content = COALESCE(?5, content),
            show_in_footer = COALESCE(?6, show_in_footer),
            is_published = COALESCE(?7, is_published),
            display_order = COALESCE(?8, display_order)
        WHERE id = ?9
      `).bind(
        title?.trim() ?? null,
        cleanSlug ?? null,
        category ?? null,
        icon ?? null,
        content ?? null,
        showInFooter !== undefined ? (showInFooter ? 1 : 0) : null,
        isPublished !== undefined ? (isPublished ? 1 : 0) : null,
        displayOrder !== undefined ? displayOrder : null,
        id
      ).run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Update custom page error:', error);
    const msg = error?.message?.includes('UNIQUE') ? 'A page with this URL slug already exists' : 'Failed to update page';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/admin/custom-pages - Delete a page
export const DELETE: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Page ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await ensureCustomPagesTable();
    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;

    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('DELETE FROM custom_pages WHERE id = ?1').bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete custom page error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete page' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
