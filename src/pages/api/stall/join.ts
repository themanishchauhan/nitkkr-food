import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../lib/db';
import { eq, and, gt, isNull } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const db = getDb(request);
    const body = await request.json();
    const { token, name, phone } = body;

    if (!token || !name?.trim() || !phone?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields: token, name, phone' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [invite] = await db.select()
      .from(schema.stallInvites)
      .where(eq(schema.stallInvites.token, token))
      .limit(1);

    if (!invite) {
      return new Response(JSON.stringify({ error: 'Invalid invite link' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const isExpired = invite.expiresAt && new Date(invite.expiresAt) < now;
    const isUsed = !!invite.usedAt;

    if (isExpired) {
      return new Response(JSON.stringify({ error: 'Invite link has expired' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (isUsed) {
      return new Response(JSON.stringify({ error: 'Invite link has already been used' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create stall member
    const [member] = await db.insert(schema.stallMembers).values({
      vendorId: invite.vendorId,
      name: name.trim(),
      phone: phone.trim(),
      inviteId: invite.id,
      isActive: 1,
    }).returning();

    // Mark invite as used
    await db.update(schema.stallInvites)
      .set({ usedAt: new Date().toISOString() })
      .where(eq(schema.stallInvites.id, invite.id));

    // Set session cookie for stall member
    const sessionData = JSON.stringify({
      memberId: member.id,
      vendorId: invite.vendorId,
      name: member.name,
      role: 'stall_member'
    });

    return new Response(JSON.stringify({ 
      success: true, 
      member,
      redirectUrl: '/stall'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `stall_session=${encodeURIComponent(sessionData)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
      },
    });
  } catch (error) {
    console.error('Stall join error:', error);
    return new Response(JSON.stringify({ error: 'Failed to join stall' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};