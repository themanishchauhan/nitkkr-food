import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../../lib/db';
import { eq } from 'drizzle-orm';

export const prerender = false;

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET || '';

function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-key');
  return authHeader === ADMIN_SECRET && ADMIN_SECRET.length > 0;
}

function getD1Db(request: Request) {
  const env = (request as any).env || (globalThis as any).env;
  const d1 = env?.DB;
  return getDb(d1);
}

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = getD1Db(request);
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid invite ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.delete(schema.stallInvites)
      .where(eq(schema.stallInvites.id, id));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete invite error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete invite' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};