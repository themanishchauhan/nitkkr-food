import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as stallInvites, t as db } from "./db_CTYqvQ5Q.mjs";
import { desc, eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
//#region src/pages/api/admin/invites/index.ts
var invites_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var ADMIN_SECRET = "";
function verifyAdminAuth(request) {
	return request.headers.get("x-admin-key") === ADMIN_SECRET && false;
}
function generateToken() {
	return randomBytes(32).toString("hex");
}
var GET = async ({ request, url }) => {
	if (!verifyAdminAuth(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ invites: [] }), {
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
		const invites = await db.select().from(stallInvites).where(eq(stallInvites.vendorId, vendorId)).orderBy(desc(stallInvites.createdAt));
		return new Response(JSON.stringify({ invites }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("List invites error:", error);
		return new Response(JSON.stringify({ invites: [] }), {
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
		const { vendorId, email, phone, expiresDays } = await request.json();
		if (!vendorId) return new Response(JSON.stringify({ error: "vendorId required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const token = generateToken();
		const expiresAt = expiresDays ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1e3) : null;
		const [invite] = await db.insert(stallInvites).values({
			vendorId,
			token,
			email: email?.trim() || null,
			phone: phone?.trim() || null,
			expiresAt
		}).returning();
		return new Response(JSON.stringify({
			success: true,
			invite
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Create invite error:", error);
		return new Response(JSON.stringify({ error: "Failed to create invite" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/invites/index@_@ts
var page = () => invites_exports;
//#endregion
export { page };
