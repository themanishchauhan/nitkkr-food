import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as categories, r as menuItems, t as db } from "./db_CTYqvQ5Q.mjs";
import { asc, eq, sql } from "drizzle-orm";
//#region src/pages/api/admin/menu/index.ts
var menu_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var ADMIN_SECRET = "";
function verifyAdminAuth(request2) {
	return request2.headers.get("x-admin-key") === ADMIN_SECRET && false;
}
var GET = async ({ url }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ items: [] }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const vendorIdParam = url.searchParams.get("vendorId");
		if (!vendorIdParam) return new Response(JSON.stringify({ error: "vendorId required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const vendorId = parseInt(vendorIdParam, 10);
		if (!vendorId || isNaN(vendorId)) return new Response(JSON.stringify({ error: "Invalid vendorId" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const items = await db.select({
			id: menuItems.id,
			vendorId: menuItems.vendorId,
			categoryId: menuItems.categoryId,
			name: menuItems.name,
			description: menuItems.description,
			price: menuItems.price,
			image: menuItems.image,
			isVeg: menuItems.isVeg,
			isAvailable: menuItems.isAvailable,
			tags: menuItems.tags,
			displayOrder: menuItems.displayOrder,
			createdAt: menuItems.createdAt,
			categoryName: categories.name,
			categorySlug: categories.slug,
			categoryIcon: categories.icon
		}).from(menuItems).leftJoin(categories, eq(menuItems.categoryId, categories.id)).where(eq(menuItems.vendorId, vendorId)).orderBy(asc(menuItems.displayOrder), asc(menuItems.name));
		return new Response(JSON.stringify({ items }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("List menu items error:", error);
		return new Response(JSON.stringify({ items: [] }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async ({ request: request2 }) => {
	if (!verifyAdminAuth(request2)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const { vendorId, categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = await request2.json();
		if (!vendorId || !name?.trim() || price === void 0 || price === "") return new Response(JSON.stringify({ error: "Missing required fields: vendorId, name, price" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const nextOrder = ((await db.select({ maxOrder: sql`max(${menuItems.displayOrder})` }).from(menuItems).where(eq(menuItems.vendorId, vendorId)))[0]?.maxOrder ?? 0) + 1;
		const [item] = await db.insert(menuItems).values({
			vendorId,
			categoryId: categoryId || null,
			name: name.trim(),
			description: description?.trim() || null,
			price: price.toString(),
			image: image?.trim() || null,
			isVeg: isVeg ?? true,
			isAvailable: isAvailable ?? true,
			tags: tags || [],
			displayOrder: displayOrder ?? nextOrder
		}).returning();
		return new Response(JSON.stringify({
			success: true,
			item
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Create menu item error:", error);
		return new Response(JSON.stringify({ error: "Failed to create menu item" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/menu/index@_@ts
var page = () => menu_exports;
//#endregion
export { page };
