import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq, asc, sql } from 'drizzle-orm';
import { verifySessionToken } from '../../../../lib/auth';

export const prerender = false;

async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  const session = await verifySessionToken(match[1]);
  return !!session;
}

function getDb() {
  return createDb();
}

const isDev = process.env.NODE_ENV !== 'production';

export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const vendors = await db.select().from(schema.vendors).orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
    if (vendors && vendors.length > 0) {
      return new Response(JSON.stringify({ vendors }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ vendors: isDev ? MOCK_VENDORS : [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List vendors error:', error);
    return new Response(JSON.stringify({ vendors: isDev ? MOCK_VENDORS : [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }
};



export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const body = await request.json();
    const { name, phone, whatsapp, address, opensAt, closesAt, deliversTo, description } = body;

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, phone, address' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await db.select({ id: schema.vendors.id }).from(schema.vendors).where(eq(schema.vendors.slug, slug)).limit(1);
    const finalSlug = existing.length > 0 ? `${slug}-${Date.now()}` : slug;

    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.vendors.displayOrder})` }).from(schema.vendors);
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [vendor] = await db.insert(schema.vendors).values({
      name: name.trim(),
      slug: finalSlug,
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      address: address.trim(),
      opensAt: opensAt || '09:00',
      closesAt: closesAt || '23:00',
      deliversTo: deliversTo || ['All Hostels'],
      isActive: true,
      isFeatured: false,
      displayOrder: nextOrder,
    } as any).returning();

    return new Response(JSON.stringify({ success: true, vendor }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const body = await request.json();
    const { id, isActive, isFeatured, name, phone, whatsapp, address, opensAt, closesAt, deliversTo } = body;

    if (!id || isNaN(parseInt(id, 10))) {
      return new Response(JSON.stringify({ error: 'Invalid vendor ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const vendorId = parseInt(id, 10);
    const updateData: Record<string, any> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    if (name?.trim()) updateData.name = name.trim();
    if (phone?.trim()) updateData.phone = phone.trim();
    if (whatsapp?.trim()) updateData.whatsapp = whatsapp.trim();
    if (address?.trim()) updateData.address = address.trim();
    if (opensAt) updateData.opensAt = opensAt;
    if (closesAt) updateData.closesAt = closesAt;
    if (deliversTo) updateData.deliversTo = deliversTo;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const [vendor] = await db.update(schema.vendors).set(updateData).where(eq(schema.vendors.id, vendorId)).returning();
    if (!vendor) {
      return new Response(JSON.stringify({ error: 'Vendor not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true, vendor }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update vendor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getDb();
    const idParam = url.searchParams.get('id');
    const id = parseInt(idParam || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid vendor ID' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    await db.delete(schema.vendors).where(eq(schema.vendors.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete vendor error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete vendor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};