import type { APIRoute } from 'astro';
import { createDb, schema, getRawD1Binding } from '../../../../lib/db';
import { eq } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

async function ensureSiteSettingsTable(rawD1: any) {
  try {
    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);').run();
    }
  } catch (e) {
    console.error('Error ensuring site_settings table in D1:', e);
  }
}

export const GET: APIRoute = async ({ request, locals }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawD1 = (locals as any)?.runtime?.env?.DB ||
                  (locals as any)?.db ||
                  getRawD1Binding();

    await ensureSiteSettingsTable(rawD1);
    
    let settingsObj: Record<string, string> = {};
    if (rawD1 && typeof rawD1.prepare === 'function') {
      const rows = await rawD1.prepare('SELECT key, value FROM site_settings').all();
      if (rows && rows.results) {
        for (const r of rows.results as any[]) {
          if (r && r.key) {
            settingsObj[r.key] = r.value;
          }
        }
      }
    } else {
      const db = createDb(locals);
      const settings = await db.select().from(schema.siteSettings);
      settingsObj = (settings || []).reduce((acc: any, setting: any) => {
        if (setting && setting.key) acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
    }

    return new Response(JSON.stringify({ settings: settingsObj }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Get settings error:', error);
    return new Response(JSON.stringify({ settings: {}, error: error?.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawD1 = (locals as any)?.runtime?.env?.DB ||
                  (locals as any)?.db ||
                  getRawD1Binding();

    await ensureSiteSettingsTable(rawD1);
    const db = createDb(locals);
    const body = await request.json();

    // 1. Batch settings update: { settings: { key: value, ... } }
    if (body.settings && typeof body.settings === 'object') {
      const entries = Object.entries(body.settings);
      
      if (rawD1 && typeof rawD1.prepare === 'function') {
        const batchStatements = entries
          .filter(([key]) => Boolean(key))
          .map(([key, value]) => 
            rawD1.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)')
                 .bind(String(key), String(value ?? ''))
          );
        
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

    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)')
        .bind(String(key), String(value)).run();
    } else {
      await db.insert(schema.siteSettings).values({ key, value: String(value) })
        .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: String(value) } });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Update setting error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to update setting' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, locals, url }) => {
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

    const rawD1 = (locals as any)?.runtime?.env?.DB ||
                  (locals as any)?.db ||
                  getRawD1Binding();

    await ensureSiteSettingsTable(rawD1);

    if (rawD1 && typeof rawD1.prepare === 'function') {
      await rawD1.prepare('DELETE FROM site_settings WHERE key = ?').bind(String(key)).run();
    } else {
      const db = createDb(locals);
      await db.delete(schema.siteSettings).where(eq(schema.siteSettings.key, key));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Delete setting error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to delete setting' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};