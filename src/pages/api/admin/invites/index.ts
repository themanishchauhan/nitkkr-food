import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../../lib/db';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET || '';

function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-key');
  return authHeader === ADMIN_SECRET && ADMIN_SECRET.length > 0;
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function getD1Db(request: Request) {
  const env = (request as any).env || (globalThis as any).env;
  const d1 = env?.DB;
  return getDb(d1);
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(request);
    const vendorIdParam = url.searchParams.get('vendorId');
    if (!vendorIdParam) {
      return new Response(JSON.stringify({ error: 'vendorId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const vendorId = parseInt(vendorIdParam, 10);
    if (!vendorId || isNaN(vendorId)) {
      return new Response(JSON.stringify({ error: 'Invalid vendorId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const invites = await db.select()
      .from(schema.stallInvites)
      .where(eq(schema.stallInvites.vendorId, vendorId))
      .orderBy(desc(schema.stallInvites.createdAt));

    return new Response(JSON.stringify({ invites }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List invites error:', error);
    return new Response(JSON.stringify({ invites: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(request);
    const body = await request.json();
    const { vendorId, email, phone, expiresDays } = body;

    if (!vendorId) {
      return new Response(JSON.stringify({ error: 'vendorId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = generateToken();
    const expiresAt = expiresDays ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString() : null;

    const [invite] = await db.insert(schema.stallInvites).values({
      vendorId,
      token,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      expiresAt,
    }).returning();

    return new Response(JSON.stringify({ success: true, invite }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create invite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};