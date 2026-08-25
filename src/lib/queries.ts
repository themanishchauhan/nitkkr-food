import { createDb, schema } from './db';
import { eq, and, asc, sql, desc } from 'drizzle-orm';
import { MOCK_VENDORS, MOCK_CATEGORIES, MOCK_MENU_ITEMS, MOCK_REVIEWS } from './mock-data';

const isDev = process.env.NODE_ENV !== 'production';

function getDb() {
  return createDb();
}

export async function getActiveVendors() {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(eq(schema.vendors.isActive, true))
      .orderBy(asc(schema.vendors.displayOrder), asc(schema.vendors.name));
    if (result && result.length > 0) return result;
    return isDev ? MOCK_VENDORS.filter(v => v.isActive) : [];
  } catch (e) {
    return isDev ? MOCK_VENDORS.filter(v => v.isActive) : [];
  }
}

export async function getVendorBySlug(slug: string) {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.slug, slug), eq(schema.vendors.isActive, true)))
      .limit(1);
    if (result && result[0]) return result[0];
    return isDev ? (MOCK_VENDORS.find(v => v.slug === slug && v.isActive) || null) : null;
  } catch (e) {
    return isDev ? (MOCK_VENDORS.find(v => v.slug === slug && v.isActive) || null) : null;
  }
}

export async function getFeaturedVendors(limit = 5) {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.vendors)
      .where(and(eq(schema.vendors.isActive, true), eq(schema.vendors.isFeatured, true)))
      .orderBy(asc(schema.vendors.displayOrder))
      .limit(limit);
    if (result && result.length > 0) return result;
    return isDev ? MOCK_VENDORS.filter(v => v.isActive && v.isFeatured).slice(0, limit) : [];
  } catch (e) {
    return isDev ? MOCK_VENDORS.filter(v => v.isActive && v.isFeatured).slice(0, limit) : [];
  }
}

export async function getCategories() {
  try {
    const db = getDb();
    const result = await db.select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.displayOrder), asc(schema.categories.name));
    if (result && result.length > 0) return result;
    return isDev ? MOCK_CATEGORIES : [];
  } catch (e) {
    return isDev ? MOCK_CATEGORIES : [];
  }
}



export async function getMenuItemsByVendor(vendorId: number) {
  try {
    const db = getDb();
    const result = await db.select({
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
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, true)))
      .orderBy(asc(schema.menuItems.displayOrder), asc(schema.menuItems.name));
    if (result && result.length > 0) return result;
    return isDev ? MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId && m.isAvailable) : [];
  } catch (e) {
    return isDev ? MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId && m.isAvailable) : [];
  }
}



export async function getMenuItemsWithReviewStats(vendorId: number) {
  try {
    const items = await getMenuItemsByVendor(vendorId);
    const vendorReviews = await getReviewsByVendor(vendorId);

    return items.map(item => {
      const itemReviews = vendorReviews.filter(r => r.menuItemId === item.id);
      const reviewCount = itemReviews.length;
      const avgRating = reviewCount > 0
        ? (itemReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
        : null;
      return {
        ...item,
        avgRating,
        reviewCount,
        recentReviews: itemReviews.slice(0, 5)
      };
    });
  } catch (e) {
    return [];
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
      image: schema.menuItems.image,
      isVeg: schema.menuItems.isVeg,
      isAvailable: schema.menuItems.isAvailable,
      tags: schema.menuItems.tags,
      vendorName: schema.vendors.name,
      vendorSlug: schema.vendors.slug,
      vendorPhone: schema.vendors.phone,
      vendorWhatsApp: schema.vendors.whatsapp,
      categoryId: schema.categories.id,
      categoryName: schema.categories.name,
      categorySlug: schema.categories.slug,
    })
      .from(schema.menuItems)
      .innerJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .leftJoin(schema.categories, eq(schema.menuItems.categoryId, schema.categories.id))
      .where(and(eq(schema.menuItems.isAvailable, true), eq(schema.vendors.isActive, true)));
  } catch (e) {
    return [];
  }
}

export function isVendorOpenNow(opensAt?: string, closesAt?: string): boolean {
  if (!opensAt || !closesAt) return true;
  try {
    const now = new Date();
    // Convert UTC to Indian Standard Time (UTC+5:30) with pure arithmetic
    const utcMinutesTotal = now.getUTCHours() * 60 + now.getUTCMinutes() + 330;
    const istMinutesTotal = (utcMinutesTotal % 1440 + 1440) % 1440;
    const istHours = Math.floor(istMinutesTotal / 60);
    const istMins = istMinutesTotal % 60;
    const istTime = `${String(istHours).padStart(2, '0')}:${String(istMins).padStart(2, '0')}`;

    if (opensAt > closesAt) {
      return istTime >= opensAt || istTime <= closesAt;
    }
    return istTime >= opensAt && istTime <= closesAt;
  } catch (e) {
    return true;
  }
}


export async function getMinPrice(vendorId: number): Promise<number | null> {
  try {
    const db = getDb();
    const result = await db.select({ minPrice: sql<number>`min(${schema.menuItems.price})` })
      .from(schema.menuItems)
      .where(and(eq(schema.menuItems.vendorId, vendorId), eq(schema.menuItems.isAvailable, true)));
    return result[0]?.minPrice ?? null;
  } catch (e) {
    return null;
  }
}

export async function getAllMinPricesByVendor(): Promise<Record<number, number>> {
  try {
    const db = getDb();
    const results = await db.select({
      vendorId: schema.menuItems.vendorId,
      minPrice: sql<number>`min(${schema.menuItems.price})`
    })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.isAvailable, true))
      .groupBy(schema.menuItems.vendorId);

    const map: Record<number, number> = {};
    for (const r of results) {
      if (r.vendorId && r.minPrice) {
        map[r.vendorId] = r.minPrice;
      }
    }
    return map;
  } catch (e) {
    return {};
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
    return [];
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
    const db = createDb();
    const maxOrderResult = await db.select({ maxOrder: sql<number>`max(${schema.menuItems.displayOrder})` })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.vendorId, data.vendorId));
    const nextOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

    const [item] = await db.insert(schema.menuItems).values({
      vendorId: data.vendorId,
      categoryId: data.categoryId || null,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      price: parseFloat(String(data.price)),
      image: data.image?.trim() || null,
      isVeg: data.isVeg ?? true,
      isAvailable: data.isAvailable ?? true,
      tags: data.tags || [],
      displayOrder: data.displayOrder ?? nextOrder,
    } as any).returning();
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
    const db = createDb();
    const updateData: Record<string, any> = {};
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.name) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.price !== undefined) updateData.price = parseFloat(String(data.price));
    if (data.image !== undefined) updateData.image = data.image?.trim() || null;
    if (data.isVeg !== undefined) updateData.isVeg = Boolean(data.isVeg);
    if (data.isAvailable !== undefined) updateData.isAvailable = Boolean(data.isAvailable);
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
    const db = createDb();
    await db.delete(schema.menuItems)
      .where(eq(schema.menuItems.id, id));
    return true;
  } catch (error) {
    console.error('Delete menu item error:', error);
    throw error;
  }
}

export async function createReview(data: {
  menuItemId: number;
  studentName: string;
  rating: number;
  comment?: string;
}) {
  try {
    const db = createDb();
    const [review] = await db.insert(schema.reviews).values({
      menuItemId: data.menuItemId,
      studentName: data.studentName.trim(),
      rating: data.rating,
      comment: data.comment?.trim() || null,
    } as any).returning();
    return review;
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
}

export async function getReviewsByMenuItem(menuItemId: number) {
  try {
    const db = createDb();
    const result = await db.select()
      .from(schema.reviews)
      .where(eq(schema.reviews.menuItemId, menuItemId))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
    return isDev ? MOCK_REVIEWS.filter(r => r.menuItemId === menuItemId) : [];
  } catch (e) {
    return isDev ? MOCK_REVIEWS.filter(r => r.menuItemId === menuItemId) : [];
  }
}

export async function getReviewsByVendor(vendorId: number) {
  try {
    const db = createDb();
    const result = await db.select({
      id: schema.reviews.id,
      menuItemId: schema.reviews.menuItemId,
      studentName: schema.reviews.studentName,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      menuItemName: schema.menuItems.name,
    })
      .from(schema.reviews)
      .innerJoin(schema.menuItems, eq(schema.reviews.menuItemId, schema.menuItems.id))
      .where(eq(schema.menuItems.vendorId, vendorId))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
  } catch (e) {
    // fallback
  }

  if (!isDev) return [];

  const vendorItemIds = MOCK_MENU_ITEMS.filter(m => m.vendorId === vendorId).map(m => m.id);
  return MOCK_REVIEWS.filter(r => vendorItemIds.includes(r.menuItemId)).map(r => {
    const item = MOCK_MENU_ITEMS.find(m => m.id === r.menuItemId);
    return {
      ...r,
      menuItemName: item?.name || 'Dish',
    };
  });
}

export async function getAllReviews() {
  try {
    const db = createDb();
    const result = await db.select({
      id: schema.reviews.id,
      menuItemId: schema.reviews.menuItemId,
      studentName: schema.reviews.studentName,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      menuItemName: schema.menuItems.name,
      vendorName: schema.vendors.name,
    })
      .from(schema.reviews)
      .leftJoin(schema.menuItems, eq(schema.reviews.menuItemId, schema.menuItems.id))
      .leftJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .orderBy(desc(schema.reviews.createdAt));
    if (result && result.length > 0) return result;
  } catch (e) {
    // fallback
  }

  if (!isDev) return [];

  return MOCK_REVIEWS.map(r => {
    const item = MOCK_MENU_ITEMS.find(m => m.id === r.menuItemId);
    const vendor = item ? MOCK_VENDORS.find(v => v.id === item.vendorId) : null;
    return {
      ...r,
      menuItemName: item?.name || 'Dish',
      vendorName: vendor?.name || 'Campus Stall',
    };
  });
}



export async function deleteReview(id: number) {
  try {
    const db = createDb();
    await db.delete(schema.reviews)
      .where(eq(schema.reviews.id, id));
    return true;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const db = createDb();
    const result = await db.select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, key))
      .limit(1);
    return result[0]?.value || null;
  } catch (e) {
    return null;
  }
}

export async function setSiteSetting(key: string, value: string) {
  try {
    const db = createDb();
    await db.insert(schema.siteSettings).values({ key, value })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value } });
    return true;
  } catch (error) {
    console.error('Set site setting error:', error);
    throw error;
  }
}

export async function getAllSiteSettings() {
  try {
    const db = createDb();
    return await db.select()
      .from(schema.siteSettings);
  } catch (e) {
    return [];
  }
}