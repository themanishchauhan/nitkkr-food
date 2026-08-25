import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

async function ensureSiteSettingsTable() {
  try {
    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;
    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);').run();
    }
  } catch (e) {
    console.error('Error ensuring site_settings table in D1:', e);
  }
}

export const GET: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureSiteSettingsTable();
    const db = createDb();
    const settings = await db.select().from(schema.siteSettings);
    const settingsObj = (settings || []).reduce((acc: any, setting: any) => {
      if (setting && setting.key) {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    return new Response(JSON.stringify({ settings: settingsObj }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return new Response(JSON.stringify({ settings: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureSiteSettingsTable();
    const db = createDb();
    const body = await request.json();

    // 1. Batch settings update: { settings: { key: value, ... } }
    if (body.settings && typeof body.settings === 'object') {
      const rawD1 = (globalThis as any).DB || 
                    (globalThis as any).__CF_ENV__?.DB || 
                    (globalThis as any).env?.DB;

      const entries = Object.entries(body.settings);
      
      if (rawD1 && typeof rawD1.prepare === 'function') {
        const stmt = rawD1.prepare('INSERT INTO site_settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2;');
        const batchStatements = entries
          .filter(([key]) => Boolean(key))
          .map(([key, value]) => stmt.bind(key, String(value ?? '')));
        
        if (batchStatements.length > 0) {
          await rawD1.batch(batchStatements);
        }
      } else {
        for (const [key, value] of entries) {
          if (key) {
            await db.insert(schema.siteSettings).values({ key, value: String(value ?? '') })
              .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: String(value ?? '') } });
          }
        }
      }

      return new Response(JSON.stringify({ success: true, count: entries.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Single setting update: { key, value }
    const { key, value } = body;
    if (!key || value === undefined) {
      return new Response(JSON.stringify({ error: 'Key and value required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawD1 = (globalThis as any).DB || 
                  (globalThis as any).__CF_ENV__?.DB || 
                  (globalThis as any).env?.DB;

    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('INSERT INTO site_settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2;')
        .bind(key, String(value)).run();
    } else {
      await db.insert(schema.siteSettings).values({ key, value: String(value) })
        .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: String(value) } });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update setting error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update setting' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const key = url.searchParams.get('key');
    if (!key) {
      return new Response(JSON.stringify({ error: 'Key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await ensureSiteSettingsTable();
    const db = createDb();
    await db.delete(schema.siteSettings).where(eq(schema.siteSettings.key, key));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete setting' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};