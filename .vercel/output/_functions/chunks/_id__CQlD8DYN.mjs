import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as menuItems, t as db } from "./db_CTYqvQ5Q.mjs";
import { eq } from "drizzle-orm";
//#region src/pages/api/admin/menu/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PATCH: () => PATCH,
	prerender: () => false
});
var ADMIN_SECRET = "";
function verifyAdminAuth(request) {
	return request.headers.get("x-admin-key") === ADMIN_SECRET && false;
}
var GET = async ({ request, params }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const id = parseInt(params.id || "", 10);
		if (!id || isNaN(id)) return new Response(JSON.stringify({ error: "Invalid menu item ID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
		if (!item) return new Response(JSON.stringify({ error: "Menu item not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({ item }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Get menu item error:", error);
		return new Response(JSON.stringify({ error: "Failed to get menu item" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var PATCH = async ({ request, params }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const id = parseInt(params.id || "", 10);
		if (!id || isNaN(id)) return new Response(JSON.stringify({ error: "Invalid menu item ID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { categoryId, name, description, price, image, isVeg, isAvailable, tags, displayOrder } = await request.json();
		const updateData = {};
		if (categoryId !== void 0) updateData.categoryId = categoryId || null;
		if (name?.trim()) updateData.name = name.trim();
		if (description !== void 0) updateData.description = description?.trim() || null;
		if (price !== void 0 && price !== "") updateData.price = price.toString();
		if (image !== void 0) updateData.image = image?.trim() || null;
		if (isVeg !== void 0) updateData.isVeg = isVeg;
		if (isAvailable !== void 0) updateData.isAvailable = isAvailable;
		if (tags !== void 0) updateData.tags = tags;
		if (displayOrder !== void 0) updateData.displayOrder = displayOrder;
		if (Object.keys(updateData).length === 0) return new Response(JSON.stringify({ error: "No valid fields to update" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const [item] = await db.update(menuItems).set(updateData).where(eq(menuItems.id, id)).returning();
		if (!item) return new Response(JSON.stringify({ error: "Menu item not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			success: true,
			item
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Update menu item error:", error);
		return new Response(JSON.stringify({ error: "Failed to update menu item" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var DELETE = async ({ request, params }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const id = parseInt(params.id || "", 10);
		if (!id || isNaN(id)) return new Response(JSON.stringify({ error: "Invalid menu item ID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		await db.delete(menuItems).where(eq(menuItems.id, id));
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Delete menu item error:", error);
		return new Response(JSON.stringify({ error: "Failed to delete menu item" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/menu/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
