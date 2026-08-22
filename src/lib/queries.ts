import { getDbFromEnv, schema } from './db';
import { eq, and, asc, sql, desc } from 'drizzle-orm';
import { MOCK_CATEGORIES, MOCK_VENDORS, MOCK_MENU_ITEMS } from './mock-data';

function getDb() {
  return getDbFromEnv();
}

export async function getActiveVendors() {
  try {
    const db = getDb();
    return await db.select()
      .from(schema.vendors)
      .where(eq(schema.vendors.isActive, 1))
      .orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
  } catch (e) {
    return MOCK_VENDORS;
  }
}

export async function getVendorBySlug(slug: string) {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.slug, slug), eq(schema.vendors.isActive, 1)))
      .limit(1);
    return result[0] || MOCK_VENDORS.find(v => v.slug === slug) || MOCK_VENDORS[0];
  } catch (e) {
    return MOCK_VENDORS.find(v => v.slug === slug) || MOCK_VENDORS[0];
  }
}

export async function getFeaturedVendors(limit = 5) {
  try {
    const db = getDb();
    return await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.isActive, 1), eq(schema.vendors.isFeatured, 1)))
      .orderBy(asc(schema.vendors.displayOrder))
      .limit(limit);
  } catch (e) {
    return MOCK_VENDORS.filter(v => v.isFeatured).slice(0, limit);
  }
}

export async function getCategories() {
  try {
    const db = getDb();
    return await db.select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
  } catch (e) {
    return MOCK_CATEGORIES;
  }
}

export async function getMenuItemsByVendor(vendorId: number) {
  try {
    const db = getDb();
    return await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      displayOrder: schema.menuItems.displayOrder,
      categoryId: schema.menuItems.categoryId,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
      categoryIcon: schema.categories.icon,
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, 1)))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
  } catch (e) {
    return MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId);
  }
}

export async function getAllMenuItemsForSearch() {
  try {
    const db = getDb();
    return await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      vendorName: schema.vendors.name,
      vendorSlug: schema.vendors.slug,
      vendorPhone: schema.vendors.phone,
      vendorWhatsApp: schema.vendors.whatsapp,
      categoryName: schema.categories.name,
    })
      .from(schema.menuItems)
      .innerJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.isAvailable, 1), eq(schema.vendors.isActive, 1)));
  } catch (e) {
    return MOCK_MENU_ITEMS.map(m => {
      const v = MOCK_VENDORS.find(v => v.id === m.vendorId);
      return {
        ...m,
        vendorName: v?.name || '',
        vendorSlug: v?.slug || '',
        vendorPhone: v?.phone || '',
        vendorWhatsApp: v?.whatsapp || '',
      };
    });
  }
}

export function isVendorOpenNow(opensAt: string, closesAt: string): boolean {
  const istTime = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  if (opensAt > closesAt) {
    return istTime >= opensAt || istTime <= closesAt;
  }
  return istTime >= opensAt && istTime <= closesAt;
}

export async function getMinPrice(vendorId: number): Promise<number | null> {
  try {
    const db = getDb();
    const result = await db.select({ minPrice: sql<number>`min(${schema.menuItems.price})` })
      .from(schema.menuItems)
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, 1)));
    return result[0]?.minPrice ?? null;
  } catch (e) {
    const items = MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId);
    if (!items.length) return null;
    return Math.min(...items.map(i => parseFloat(i.price)));
  }
}

export async function getAllMenuItemsByVendor(vendorId: number) {
  try {
    const db = getDb();
    return await db.select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      description: schema.menuItems.description,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      displayOrder: schema.menuItems.displayOrder,
      categoryId: schema.menuItems.categoryId,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
      categoryIcon: schema.categories.icon,
    })
      .from(schema.menuItems)
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(eq(schema.menuItems.vendorId, vendorId))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
  } catch (e) {
    return MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId);
  }
}

export async function createMenuItem(data: {
  vendorId: number;
  categoryId?: number | null;
  name: string;
  description?: string | null;
  price: string | number;
  image?: string | null;
  isVeg?: boolean;
  isAvailable?: boolean;
  tags?: string[];
  displayOrder?: number;
}) {
  try {
    const db = getDb();
    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.menuItems.displayOrder})` })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.vendorId, data.vendorId));
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [item] = await db.insert(schema.menuItems).values({
      vendorId: data.vendorId,
      categoryId: data.categoryId || null,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      price: data.price.toString(),
      image: data.image?.trim() || null,
      isVeg: data.isVeg ?? true,
      isAvailable: data.isAvailable ?? true,
      tags: data.tags || [],
      displayOrder: data.displayOrder ?? nextOrder,
    }).returning();
    return item;
  } catch (error) {
    console.error('Create menu item error:', error);
    throw error;
  }
}

export async function updateMenuItem(id: number, data: Partial<{
  categoryId: number | null;
  name: string;
  description: string | null;
  price: string | number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  tags: string[];
  displayOrder: number;
}>) {
  try {
    const db = getDb();
    const updateData: Record<string, any> = {};
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.name) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.price !== undefined) updateData.price = data.price.toString();
    if (data.image !== undefined) updateData.image = data.image?.trim() || null;
    if (data.isVeg !== undefined) updateData.isVeg = data.isVeg;
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

    if (Object.keys(updateData).length === 0) return null;

    const [item] = await db.update(schema.menuItems)
      .set(updateData)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return item;
  } catch (error) {
    console.error('Update menu item error:', error);
    throw error;
  }
}

export async function deleteMenuItem(id: number) {
  try {
    const db = getDb();
    await db.delete(schema.menuItems)
      .where(eq(schema.menuItems.id, id));
    return true;
  } catch (error) {
    console.error('Delete menu item error:', error);
    throw error;
  }
}