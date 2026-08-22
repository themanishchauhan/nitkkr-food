import { n as categories, o as vendors, r as menuItems, t as db } from "./db_CTYqvQ5Q.mjs";
import { n as MOCK_MENU_ITEMS, r as MOCK_VENDORS, t as MOCK_CATEGORIES } from "./mock-data_DapPhx2P.mjs";
import { and, asc, eq, sql } from "drizzle-orm";
//#region src/lib/queries.ts
async function getActiveVendors() {
	if (!process.env.DATABASE_URL) return MOCK_VENDORS;
	try {
		return await db.select().from(vendors).where(eq(vendors.isActive, true)).orderBy(asc(vendors.displayOrder), asc(vendors.name));
	} catch (e) {
		return MOCK_VENDORS;
	}
}
async function getVendorBySlug(slug) {
	if (!process.env.DATABASE_URL) return MOCK_VENDORS.find((v) => v.slug === slug) || MOCK_VENDORS[0];
	try {
		return (await db.select().from(vendors).where(and(eq(vendors.slug, slug), eq(vendors.isActive, true))).limit(1))[0] || MOCK_VENDORS.find((v) => v.slug === slug) || MOCK_VENDORS[0];
	} catch (e) {
		return MOCK_VENDORS.find((v) => v.slug === slug) || MOCK_VENDORS[0];
	}
}
async function getCategories() {
	if (!process.env.DATABASE_URL) return MOCK_CATEGORIES;
	try {
		return await db.select().from(categories).orderBy(asc(categories.displayOrder), asc(categories.name));
	} catch (e) {
		return MOCK_CATEGORIES;
	}
}
async function getMenuItemsByVendor(vendorId) {
	if (!process.env.DATABASE_URL) return MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
	try {
		return await db.select({
			id: menuItems.id,
			name: menuItems.name,
			description: menuItems.description,
			price: menuItems.price,
			image: menuItems.image,
			isVeg: menuItems.isVeg,
			isAvailable: menuItems.isAvailable,
			tags: menuItems.tags,
			displayOrder: menuItems.displayOrder,
			categoryId: menuItems.categoryId,
			categoryName: categories.name,
			categorySlug: categories.slug,
			categoryIcon: categories.icon
		}).from(menuItems).leftJoin(categories, eq(menuItems.categoryId, categories.id)).where(and(eq(menuItems.vendorId, vendorId), eq(menuItems.isAvailable, true))).orderBy(asc(menuItems.displayOrder), asc(menuItems.name));
	} catch (e) {
		return MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
	}
}
async function getAllMenuItemsForSearch() {
	if (!process.env.DATABASE_URL) return MOCK_MENU_ITEMS.map((m) => {
		const v = MOCK_VENDORS.find((v) => v.id === m.vendorId);
		return {
			...m,
			vendorName: v?.name || "",
			vendorSlug: v?.slug || "",
			vendorPhone: v?.phone || "",
			vendorWhatsApp: v?.whatsapp || ""
		};
	});
	try {
		return await db.select({
			id: menuItems.id,
			name: menuItems.name,
			description: menuItems.description,
			price: menuItems.price,
			isVeg: menuItems.isVeg,
			isAvailable: menuItems.isAvailable,
			tags: menuItems.tags,
			vendorName: vendors.name,
			vendorSlug: vendors.slug,
			vendorPhone: vendors.phone,
			vendorWhatsApp: vendors.whatsapp,
			categoryName: categories.name
		}).from(menuItems).innerJoin(vendors, eq(menuItems.vendorId, vendors.id)).leftJoin(categories, eq(menuItems.categoryId, categories.id)).where(and(eq(menuItems.isAvailable, true), eq(vendors.isActive, true)));
	} catch (e) {
		return MOCK_MENU_ITEMS.map((m) => {
			const v = MOCK_VENDORS.find((v) => v.id === m.vendorId);
			return {
				...m,
				vendorName: v?.name || "",
				vendorSlug: v?.slug || "",
				vendorPhone: v?.phone || "",
				vendorWhatsApp: v?.whatsapp || ""
			};
		});
	}
}
function isVendorOpenNow(opensAt, closesAt) {
	const currentTime = (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5);
	if (opensAt > closesAt) return currentTime >= opensAt || currentTime <= closesAt;
	return currentTime >= opensAt && currentTime <= closesAt;
}
async function getMinPrice(vendorId) {
	if (!process.env.DATABASE_URL) {
		const items = MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
		if (!items.length) return null;
		return Math.min(...items.map((i) => parseFloat(i.price)));
	}
	try {
		return await db.select({ minPrice: sql`min(${menuItems.price})` }).from(menuItems).where(and(eq(menuItems.vendorId, vendorId), eq(menuItems.isAvailable, true))).then((r) => r[0]?.minPrice ?? null);
	} catch (e) {
		const items = MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
		if (!items.length) return null;
		return Math.min(...items.map((i) => parseFloat(i.price)));
	}
}
async function getAllMenuItemsByVendor(vendorId) {
	if (!process.env.DATABASE_URL) return MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
	try {
		return await db.select({
			id: menuItems.id,
			name: menuItems.name,
			description: menuItems.description,
			price: menuItems.price,
			image: menuItems.image,
			isVeg: menuItems.isVeg,
			isAvailable: menuItems.isAvailable,
			tags: menuItems.tags,
			displayOrder: menuItems.displayOrder,
			categoryId: menuItems.categoryId,
			categoryName: categories.name,
			categorySlug: categories.slug,
			categoryIcon: categories.icon
		}).from(menuItems).leftJoin(categories, eq(menuItems.categoryId, categories.id)).where(eq(menuItems.vendorId, vendorId)).orderBy(asc(menuItems.displayOrder), asc(menuItems.name));
	} catch (e) {
		return MOCK_MENU_ITEMS.filter((m) => m.vendorId === vendorId);
	}
}
//#endregion
export { getMenuItemsByVendor as a, isVendorOpenNow as c, getCategories as i, getAllMenuItemsByVendor as n, getMinPrice as o, getAllMenuItemsForSearch as r, getVendorBySlug as s, getActiveVendors as t };
