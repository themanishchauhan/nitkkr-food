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
    const { getActiveVendors, ensureRealDatabasePopulated } = await import('../../../../lib/queries');
    await ensureRealDatabasePopulated();
    const vendors = await getActiveVendors();

    return new Response(JSON.stringify({ vendors: vendors || [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List vendors error:', error);
    const { MOCK_VENDORS } = await import('../../../../lib/mock-data');
    return new Response(JSON.stringify({ vendors: MOCK_VENDORS }), {
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
    const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
    await ensureRealDatabasePopulated();

    const db = createDb();
    const body = await request.json();
    const { name, phone, whatsapp, address, opensAt, closesAt, deliversTo, description, image, isFeatured } = body;

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
        : ['NITKKR campus all'];

    const rawD1 = (await import('../../../../lib/db')).getRawD1Binding();
    if (rawD1 && typeof rawD1.prepare === 'function') {
      try {
        await rawD1.prepare(`
          INSERT INTO vendors (name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, description, is_active, is_featured, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          name.trim(),
          slug,
          phone.trim(),
          whatsapp?.trim() || phone.trim(),
          address?.trim() || 'NIT Kurukshetra',
          null,
          null,
          opensAt || '09:00',
          closesAt || '23:00',
          JSON.stringify(deliversToArray),
          image?.trim() || null,
          description?.trim() || null,
          1,
          isFeatured ? 1 : 0,
          0
        ).run();

        const inserted = await rawD1.prepare(`SELECT * FROM vendors WHERE slug = ? LIMIT 1`).bind(slug).first();
        return new Response(JSON.stringify({ success: true, vendor: inserted }), {
          status: 201, headers: { 'Content-Type': 'application/json' },
        });
      } catch (rawErr) {
        console.warn('Raw D1 insert error, falling back to Drizzle:', rawErr);
      }
    }

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
      isFeatured: Boolean(isFeatured),
    }).returning();

    return new Response(JSON.stringify({ success: true, vendor }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to create vendor' }), {
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
    const rawD1 = (await import('../../../../lib/db')).getRawD1Binding();

    if (rawD1 && typeof rawD1.prepare === 'function') {
      try {
        const check = await rawD1.prepare(`SELECT id FROM vendors WHERE id = ? LIMIT 1`).bind(vendorId).first();
        if (!check) {
          const { FOOD_CAVE_VENDOR } = await import('../../../../lib/food-cave-data');
          await rawD1.prepare(`
            INSERT OR REPLACE INTO vendors (id, name, slug, phone, whatsapp, address, latitude, longitude, opens_at, closes_at, delivers_to, image, is_active, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            vendorId,
            updates.name || FOOD_CAVE_VENDOR.name,
            FOOD_CAVE_VENDOR.slug,
            updates.phone || FOOD_CAVE_VENDOR.phone,
            updates.whatsapp || FOOD_CAVE_VENDOR.whatsapp,
            updates.address || FOOD_CAVE_VENDOR.address,
            FOOD_CAVE_VENDOR.latitude,
            FOOD_CAVE_VENDOR.longitude,
            updates.opensAt || FOOD_CAVE_VENDOR.opensAt,
            updates.closesAt || FOOD_CAVE_VENDOR.closesAt,
            JSON.stringify(updates.deliversTo || FOOD_CAVE_VENDOR.deliversTo),
            updates.image || FOOD_CAVE_VENDOR.image,
            updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : 1,
            updates.isFeatured !== undefined ? (updates.isFeatured ? 1 : 0) : 1,
            FOOD_CAVE_VENDOR.displayOrder
          ).run();
        } else {
          await rawD1.prepare(`
            UPDATE vendors SET 
              name = COALESCE(?, name),
              phone = COALESCE(?, phone),
              whatsapp = COALESCE(?, whatsapp),
              address = COALESCE(?, address),
              opens_at = COALESCE(?, opens_at),
              closes_at = COALESCE(?, closes_at),
              delivers_to = COALESCE(?, delivers_to),
              image = COALESCE(?, image),
              description = COALESCE(?, description),
              is_active = COALESCE(?, is_active),
              is_featured = COALESCE(?, is_featured)
            WHERE id = ?
          `).bind(
            updates.name !== undefined ? updates.name : null,
            updates.phone !== undefined ? updates.phone : null,
            updates.whatsapp !== undefined ? updates.whatsapp : null,
            updates.address !== undefined ? updates.address : null,
            updates.opensAt !== undefined ? updates.opensAt : null,
            updates.closesAt !== undefined ? updates.closesAt : null,
            updates.deliversTo !== undefined ? JSON.stringify(updates.deliversTo) : null,
            updates.image !== undefined ? updates.image : null,
            updates.description !== undefined ? updates.description : null,
            updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : null,
            updates.isFeatured !== undefined ? (updates.isFeatured ? 1 : 0) : null,
            vendorId
          ).run();
        }

        const saved = await rawD1.prepare(`SELECT * FROM vendors WHERE id = ? LIMIT 1`).bind(vendorId).first();
        return new Response(JSON.stringify({ success: true, vendor: saved || updates }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      } catch (rawErr) {
        console.warn('Raw D1 fallback error, trying Drizzle:', rawErr);
      }
    }

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