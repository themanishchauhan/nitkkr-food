import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { eq, asc, sql, inArray } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const db = createDb();
    const vendorIdParam = url.searchParams.get('vendorId');

    const baseQuery = db.select({
      id: schema.menuItems.id,
      vendorId: schema.menuItems.vendorId,
      categoryId: schema.menuItems.categoryId,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      displayOrder: schema.menuItems.displayOrder,
      createdAt: schema.menuItems.createdAt,
      categoryName: schema.categories.name,
      vendorName: schema.vendors.name,
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .leftJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id));

    let items = vendorIdParam && !isNaN(parseInt(vendorIdParam, 10))
      ? await baseQuery.where(eq(schema.menuItems.vendorId, parseInt(vendorIdParam, 10))).orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name))
      : await baseQuery.orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));

    if (!items || items.length === 0) {
      const { ensureRealDatabasePopulated } = await import('../../../../lib/queries');
      await ensureRealDatabasePopulated();
      items = vendorIdParam && !isNaN(parseInt(vendorIdParam, 10))
        ? await baseQuery.where(eq(schema.menuItems.vendorId, parseInt(vendorIdParam, 10))).orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name))
        : await baseQuery.orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
    }

    if (!items || items.length === 0) {
      const { FOOD_CAVE_MENU_ITEMS } = await import('../../../../lib/food-cave-data');
      const { MOCK_CATEGORIES } = await import('../../../../lib/mock-data');
      items = FOOD_CAVE_MENU_ITEMS.map((item: any) => {
        const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
        return {
          ...item,
          vendorName: 'Food Cave Fast Food',
          categoryName: cat?.name || 'General'
        };
      }) as any;
    }

    return new Response(JSON.stringify({ items: items || [] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('List menu items error:', error);
    const { FOOD_CAVE_MENU_ITEMS } = await import('../../../../lib/food-cave-data');
    const { MOCK_CATEGORIES } = await import('../../../../lib/mock-data');
    const items = FOOD_CAVE_MENU_ITEMS.map((item: any) => {
      const cat = MOCK_CATEGORIES.find((c: any) => c.id === item.categoryId);
      return {
        ...item,
        vendorName: 'Food Cave Fast Food',
        categoryName: cat?.name || 'General'
      };
    });
    return new Response(JSON.stringify({ items: items || [] }), {
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
    const { vendorId, categoryId, name, description, price, image, isVeg, isAvailable, tags } = body;

    if (!vendorId || !name?.trim() || price === undefined) {
      return new Response(JSON.stringify({ error: 'Vendor, item name, and price are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const tagsArray = Array.isArray(tags) 
      ? tags 
      : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

    const [item] = await db.insert(schema.menuItems).values({
      vendorId: Number(vendorId),
      categoryId: categoryId ? Number(categoryId) : null,
      name: name.trim(),
      description: description ? description.trim() : null,
      price: Number(price),
      image: image ? image.trim() : null,
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      tags: tagsArray,
    }).returning();

    return new Response(JSON.stringify({ success: true, item }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create menu item' }), {
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
    const db = createDb();
    const body = await request.json();
    const { id, vendorId, categoryId, name, description, price, image, isVeg, isAvailable, tags, bulkIds } = body;

    // Bulk availability toggle (UX-1)
    if (Array.isArray(bulkIds) && bulkIds.length > 0 && typeof isAvailable === 'boolean') {
      await db.update(schema.menuItems).set({ isAvailable }).where(inArray(schema.menuItems.id, bulkIds.map(Number)));
      return new Response(JSON.stringify({ success: true, count: bulkIds.length }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Item ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates: any = {};
    if (vendorId !== undefined) updates.vendorId = Number(vendorId);
    if (categoryId !== undefined) updates.categoryId = categoryId ? Number(categoryId) : null;
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (price !== undefined) updates.price = Number(price);
    if (image !== undefined) updates.image = image ? image.trim() : null;
    if (isVeg !== undefined) updates.isVeg = Boolean(isVeg);
    if (isAvailable !== undefined) updates.isAvailable = Boolean(isAvailable);
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    }

    const [item] = await db.update(schema.menuItems).set(updates).where(eq(schema.menuItems.id, Number(id))).returning();

    return new Response(JSON.stringify({ success: true, item }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update menu item' }), {
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
      return new Response(JSON.stringify({ error: 'Item ID is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = createDb();
    const itemId = parseInt(idParam, 10);
    await db.delete(schema.menuItems).where(eq(schema.menuItems.id, itemId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete menu item' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};