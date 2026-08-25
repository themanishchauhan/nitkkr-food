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

function getDb(locals?: any) {
  const env = locals?.runtime?.env || (globalThis as any).DB || (globalThis as any).env?.DB;
  return createDb(env ? { DB: env } : undefined);
}

export const GET: APIRoute = async ({ request, locals }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getDb(locals);
    const settings = await db.select().from(schema.siteSettings);
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    return new Response(JSON.stringify({ settings: settingsObj }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getDb(locals);
    const body = await request.json();

    // 1. Batch settings update: { settings: { key: value, ... } }
    if (body.settings && typeof body.settings === 'object') {
      const entries = Object.entries(body.settings);
      for (const [key, value] of entries) {
        if (key) {
          await db.insert(schema.siteSettings).values({ key, value: String(value ?? '') })
            .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: String(value ?? '') } });
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

    await db.insert(schema.siteSettings).values({ key, value: String(value) })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: String(value) } });

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

export const DELETE: APIRoute = async ({ request, url, locals }) => {
  if (!await isAuthenticated(request)) {
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

    const db = getDb(locals);
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