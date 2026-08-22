import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { o as vendors, t as db } from "./db_CTYqvQ5Q.mjs";
import { asc, eq, sql } from "drizzle-orm";
//#region src/pages/api/admin/vendors/index.ts
var vendors_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	PATCH: () => PATCH,
	POST: () => POST,
	prerender: () => false
});
var ADMIN_SECRET = "";
function verifyAdminAuth(request) {
	return request.headers.get("x-admin-key") === ADMIN_SECRET && false;
}
var GET = async ({ url }) => {
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ vendors: [] }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const idParam = url.searchParams.get("id");
		if (idParam) {
			const id = parseInt(idParam, 10);
			if (!id || isNaN(id)) return new Response(JSON.stringify({ error: "Invalid vendor ID" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
			if (!vendor) return new Response(JSON.stringify({ error: "Vendor not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			return new Response(JSON.stringify({ vendor }), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}
		const vendors$1 = await db.select().from(vendors).orderBy(asc(vendors.displayOrder), asc(vendors.name));
		return new Response(JSON.stringify({ vendors: vendors$1 }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("List vendors error:", error);
		return new Response(JSON.stringify({ vendors: [] }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async ({ request }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const { name, phone, whatsapp, address, opensAt, closesAt, deliversTo } = await request.json();
		if (!name?.trim() || !phone?.trim() || !address?.trim()) return new Response(JSON.stringify({ error: "Missing required fields: name, phone, address" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
		const existing = await db.select({ id: vendors.id }).from(vendors).where(eq(vendors.slug, slug)).limit(1);
		let finalSlug = slug;
		if (existing.length > 0) finalSlug = `${slug}-${Date.now()}`;
		const nextOrder = ((await db.select({ maxOrder: sql`max(${vendors.displayOrder})` }).from(vendors))[0]?.maxOrder ?? 0) + 1;
		const [vendor] = await db.insert(vendors).values({
			name: name.trim(),
			slug: finalSlug,
			phone: phone.trim(),
			whatsapp: whatsapp?.trim() || phone.trim(),
			address: address.trim(),
			opensAt: opensAt || "09:00",
			closesAt: closesAt || "23:00",
			deliversTo: deliversTo || ["All Hostels"],
			isActive: true,
			isFeatured: false,
			displayOrder: nextOrder
		}).returning();
		return new Response(JSON.stringify({
			success: true,
			vendor
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Create vendor error:", error);
		return new Response(JSON.stringify({ error: "Failed to create vendor" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var PATCH = async ({ request }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const { id, isActive, name, phone, whatsapp, address, opensAt, closesAt, deliversTo } = await request.json();
		if (!id || isNaN(parseInt(id, 10))) return new Response(JSON.stringify({ error: "Invalid vendor ID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const vendorId = parseInt(id, 10);
		const updateData = {};
		if (typeof isActive === "boolean") updateData.isActive = isActive;
		if (name?.trim()) updateData.name = name.trim();
		if (phone?.trim()) updateData.phone = phone.trim();
		if (whatsapp?.trim()) updateData.whatsapp = whatsapp.trim();
		if (address?.trim()) updateData.address = address.trim();
		if (opensAt) updateData.opensAt = opensAt;
		if (closesAt) updateData.closesAt = closesAt;
		if (deliversTo) updateData.deliversTo = deliversTo;
		if (Object.keys(updateData).length === 0) return new Response(JSON.stringify({ error: "No valid fields to update" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const [vendor] = await db.update(vendors).set(updateData).where(eq(vendors.id, vendorId)).returning();
		if (!vendor) return new Response(JSON.stringify({ error: "Vendor not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			success: true,
			vendor
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Update vendor error:", error);
		return new Response(JSON.stringify({ error: "Failed to update vendor" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/vendors/index@_@ts
var page = () => vendors_exports;
//#endregion
export { page };
