import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../../lib/db';
import { eq, desc, asc, sql } from 'drizzle-orm';

export const prerender = false;

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET || '';

function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-key');
  if (!ADMIN_SECRET || ADMIN_SECRET.length === 0) {
    return true;
  }
  return authHeader === ADMIN_SECRET;
}

function getD1Db(context: any) {
  const env = context?.locals?.runtime?.env || context?.request?.env || (globalThis as any).env;
  try {
    return getDb(env?.DB);
  } catch (e) {
    return getDb();
  }
}

export const GET: APIRoute = async (context) => {
  const { url } = context;
  try {
    const db = getD1Db(context);

    const idParam = url.searchParams.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!id || isNaN(id)) {
        return new Response(JSON.stringify({ error: 'Invalid vendor ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const [vendor] = await db.select()
        .from(schema.vendors)
        .where(eq(schema.vendors.id, id))
        .limit(1);

      if (!vendor) {
        return new Response(JSON.stringify({ error: 'Vendor not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ vendor }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const vendors = await db.select()
      .from(schema.vendors)
      .orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));

    return new Response(JSON.stringify({ vendors }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List vendors error:', error);
    return new Response(JSON.stringify({ vendors: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async (context) => {
  const { request } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getD1Db(context);
    const body = await request.json();
    const { name, phone, whatsapp, address, opensAt, closesAt, deliversTo } = body;

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, phone, address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await db.select({ id: schema.vendors.id })
      .from(schema.vendors)
      .where(eq(schema.vendors.slug, slug))
      .limit(1);

    let finalSlug = slug;
    if (existing.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.vendors.displayOrder})` })
      .from(schema.vendors);
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
      isActive: 1,
      isFeatured: 0,
      displayOrder: nextOrder,
    } as any).returning();

    return new Response(JSON.stringify({ success: true, vendor }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async (context) => {
  const { request } = context;
  if (!verifyAdminAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = getD1Db(context);
    const body = await request.json();
    const { id, isActive, name, phone, whatsapp, address, opensAt, closesAt, deliversTo } = body;

    if (!id || isNaN(parseInt(id, 10))) {
      return new Response(JSON.stringify({ error: 'Invalid vendor ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const vendorId = parseInt(id, 10);
    const updateData: Record<string, any> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive ? 1 : 0;
    if (name?.trim()) updateData.name = name.trim();
    if (phone?.trim()) updateData.phone = phone.trim();
    if (whatsapp?.trim()) updateData.whatsapp = whatsapp.trim();
    if (address?.trim()) updateData.address = address.trim();
    if (opensAt) updateData.opensAt = opensAt;
    if (closesAt) updateData.closesAt = closesAt;
    if (deliversTo) updateData.deliversTo = deliversTo;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [vendor] = await db.update(schema.vendors)
      .set(updateData)
      .where(eq(schema.vendors.id, vendorId))
      .returning();

    if (!vendor) {
      return new Response(JSON.stringify({ error: 'Vendor not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, vendor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};