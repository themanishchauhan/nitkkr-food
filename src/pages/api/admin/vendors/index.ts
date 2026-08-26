import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq, asc, sql, inArray } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const GET: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    let vendors = await db.select().from(schema.vendors).orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
    
    if (!vendors || vendors.length === 0) {
      const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
      await ensureRealDatabasePopulated();
      vendors = await db.select().from(schema.vendors).orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
    }

    if (!vendors || vendors.length === 0) {
      const { FOOD_CAVE_VENDOR } = await import('../../../../lib/food-cave-data');
      vendors = [FOOD_CAVE_VENDOR as any];
    }

    return new Response(JSON.stringify({ vendors: vendors || [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List vendors error:', error);
    const { FOOD_CAVE_VENDOR } = await import('../../../../lib/food-cave-data');
    return new Response(JSON.stringify({ vendors: [FOOD_CAVE_VENDOR as any] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }
};


export const POST: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    const body = await request.json();
    const { name, phone, whatsapp, address, opensAt, closesAt, deliversTo, description, image } = body;

    if (!name?.trim() || !phone?.trim()) {
      return new Response(JSON.stringify({ error: 'Name and phone are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    let slug = slugify(name);
    const existing = await db.select({ id: schema.vendors.id }).from(schema.vendors).where(eq(schema.vendors.slug, slug));
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const deliversToArray = Array.isArray(deliversTo) 
      ? deliversTo 
      : typeof deliversTo === 'string' && deliversTo.trim()
        ? deliversTo.split(',').map((s: string) => s.trim()).filter(Boolean)
        : ['Hostels', 'Campus'];

    const [vendor] = await db.insert(schema.vendors).values({
      name: name.trim(),
      slug,
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      address: address?.trim() || 'NIT Kurukshetra',
      image: image?.trim() || null,
      description: description?.trim() || null,
      opensAt: opensAt || '09:00',
      closesAt: closesAt || '23:00',
      deliversTo: deliversToArray,
      isActive: true,
    }).returning();

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
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
    await ensureRealDatabasePopulated();

    const db = createDb();
    const body = await request.json();
    const { id, name, phone, whatsapp, address, opensAt, closesAt, deliversTo, description, isActive, isFeatured, image, bulkIds } = body;

    // Bulk activate/deactivate support (UX-1)
    if (Array.isArray(bulkIds) && bulkIds.length > 0 && typeof isActive === 'boolean') {
      await db.update(schema.vendors).set({ isActive }).where(inArray(schema.vendors.id, bulkIds.map(Number)));
      return new Response(JSON.stringify({ success: true, count: bulkIds.length }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Vendor ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (whatsapp !== undefined) updates.whatsapp = whatsapp.trim();
    if (address !== undefined) updates.address = address.trim();
    if (opensAt !== undefined) updates.opensAt = opensAt;
    if (closesAt !== undefined) updates.closesAt = closesAt;
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (image !== undefined) updates.image = image ? image.trim() : null;
    if (isActive !== undefined) updates.isActive = Boolean(isActive);
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);
    if (deliversTo !== undefined) {
      updates.deliversTo = Array.isArray(deliversTo)
        ? deliversTo
        : typeof deliversTo === 'string'
          ? deliversTo.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
    }

    const vendorId = Number(id);
    const existing = await db.select().from(schema.vendors).where(eq(schema.vendors.id, vendorId)).limit(1);

    if (!existing || existing.length === 0) {
      const { FOOD_CAVE_VENDOR } = await import('../../../../lib/food-cave-data');
      await db.insert(schema.vendors).values({
        id: vendorId,
        name: updates.name || FOOD_CAVE_VENDOR.name,
        slug: FOOD_CAVE_VENDOR.slug,
        phone: updates.phone || FOOD_CAVE_VENDOR.phone,
        whatsapp: updates.whatsapp || FOOD_CAVE_VENDOR.whatsapp,
        address: updates.address || FOOD_CAVE_VENDOR.address,
        opensAt: updates.opensAt || FOOD_CAVE_VENDOR.opensAt,
        closesAt: updates.closesAt || FOOD_CAVE_VENDOR.closesAt,
        deliversTo: updates.deliversTo || FOOD_CAVE_VENDOR.deliversTo,
        image: updates.image || FOOD_CAVE_VENDOR.image,
        isActive: updates.isActive !== undefined ? updates.isActive : true,
        isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : true,
      });
    } else {
      await db.update(schema.vendors).set(updates).where(eq(schema.vendors.id, vendorId));
    }

    const [vendor] = await db.select().from(schema.vendors).where(eq(schema.vendors.id, vendorId)).limit(1);

    return new Response(JSON.stringify({ success: true, vendor: vendor || updates }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Update vendor error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to update vendor' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};


export const DELETE: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const idParam = url.searchParams.get('id');
    if (!idParam) {
      return new Response(JSON.stringify({ error: 'Vendor ID required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = createDb();
    const vendorId = parseInt(idParam, 10);
    await db.delete(schema.vendors).where(eq(schema.vendors.id, vendorId));

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