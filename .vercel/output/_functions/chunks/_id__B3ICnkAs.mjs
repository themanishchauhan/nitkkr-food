import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as stallInvites, t as db } from "./db_CTYqvQ5Q.mjs";
import { eq } from "drizzle-orm";
//#region src/pages/api/admin/invites/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	prerender: () => false
});
var ADMIN_SECRET = "";
function verifyAdminAuth(request) {
	return request.headers.get("x-admin-key") === ADMIN_SECRET && false;
}
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
		if (!id || isNaN(id)) return new Response(JSON.stringify({ error: "Invalid invite ID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		await db.delete(stallInvites).where(eq(stallInvites.id, id));
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Delete invite error:", error);
		return new Response(JSON.stringify({ error: "Failed to delete invite" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/admin/invites/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
