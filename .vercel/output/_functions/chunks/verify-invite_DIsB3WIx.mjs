import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as stallInvites, o as vendors, t as db } from "./db_CTYqvQ5Q.mjs";
import { eq } from "drizzle-orm";
//#region src/pages/api/stall/verify-invite.ts
var verify_invite_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	try {
		const token = url.searchParams.get("token");
		if (!token) return new Response(JSON.stringify({ error: "Token required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({
			valid: false,
			error: "Database not configured"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const [invite] = await db.select({
			id: stallInvites.id,
			vendorId: stallInvites.vendorId,
			email: stallInvites.email,
			phone: stallInvites.phone,
			expiresAt: stallInvites.expiresAt,
			usedAt: stallInvites.usedAt,
			vendorName: vendors.name,
			vendorSlug: vendors.slug
		}).from(stallInvites).innerJoin(vendors, eq(stallInvites.vendorId, vendors.id)).where(eq(stallInvites.token, token)).limit(1);
		if (!invite) return new Response(JSON.stringify({
			valid: false,
			error: "Invalid invite link"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const now = /* @__PURE__ */ new Date();
		const isExpired = invite.expiresAt && invite.expiresAt < now;
		const isUsed = !!invite.usedAt;
		if (isExpired) return new Response(JSON.stringify({
			valid: false,
			error: "Invite link has expired"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		if (isUsed) return new Response(JSON.stringify({
			valid: false,
			error: "Invite link has already been used"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			valid: true,
			vendor: {
				id: invite.vendorId,
				name: invite.vendorName,
				slug: invite.vendorSlug
			}
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Verify invite error:", error);
		return new Response(JSON.stringify({
			valid: false,
			error: "Failed to verify invite"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/stall/verify-invite@_@ts
var page = () => verify_invite_exports;
//#endregion
export { page };
