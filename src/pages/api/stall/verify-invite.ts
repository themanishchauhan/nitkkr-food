import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../lib/db';
import { eq, and, gt, isNull } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const db = getDb(request);
    const token = url.searchParams.get('token');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [invite] = await db.select({
      id: schema.stallInvites.id,
      vendorId: schema.stallInvites.vendorId,
      email: schema.stallInvites.email,
      phone: schema.stallInvites.phone,
      expiresAt: schema.stallInvites.expiresAt,
      usedAt: schema.stallInvites.usedAt,
      vendorName: schema.vendors.name,
      vendorSlug: schema.vendors.slug,
    })
      .from(schema.stallInvites)
      .innerJoin(schema.vendors, eq(schema.stallInvites.vendorId, schema.vendors.id))
      .where(eq(schema.stallInvites.token, token))
      .limit(1);

    if (!invite) {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid invite link' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const isExpired = invite.expiresAt && new Date(invite.expiresAt) < now;
    const isUsed = !!invite.usedAt;

    if (isExpired) {
      return new Response(JSON.stringify({ valid: false, error: 'Invite link has expired' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (isUsed) {
      return new Response(JSON.stringify({ valid: false, error: 'Invite link has already been used' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      valid: true, 
      vendor: {
        id: invite.vendorId,
        name: invite.vendorName,
        slug: invite.vendorSlug,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verify invite error:', error);
    return new Response(JSON.stringify({ valid: false, error: 'Failed to verify invite' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};