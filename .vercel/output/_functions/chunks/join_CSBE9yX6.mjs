import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as stallMembers, i as stallInvites, t as db } from "./db_CTYqvQ5Q.mjs";
import { eq } from "drizzle-orm";
//#region src/pages/api/stall/join.ts
var join_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request }) => {
	try {
		if (!process.env.DATABASE_URL) return new Response(JSON.stringify({ error: "Database not configured" }), {
			status: 503,
			headers: { "Content-Type": "application/json" }
		});
		const { token, name, phone } = await request.json();
		if (!token || !name?.trim() || !phone?.trim()) return new Response(JSON.stringify({ error: "Missing required fields: token, name, phone" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const [invite] = await db.select().from(stallInvites).where(eq(stallInvites.token, token)).limit(1);
		if (!invite) return new Response(JSON.stringify({ error: "Invalid invite link" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const now = /* @__PURE__ */ new Date();
		const isExpired = invite.expiresAt && invite.expiresAt < now;
		const isUsed = !!invite.usedAt;
		if (isExpired) return new Response(JSON.stringify({ error: "Invite link has expired" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (isUsed) return new Response(JSON.stringify({ error: "Invite link has already been used" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const [member] = await db.insert(stallMembers).values({
			vendorId: invite.vendorId,
			name: name.trim(),
			phone: phone.trim(),
			inviteId: invite.id,
			isActive: true
		}).returning();
		await db.update(stallInvites).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq(stallInvites.id, invite.id));
		const sessionData = JSON.stringify({
			memberId: member.id,
			vendorId: invite.vendorId,
			name: member.name,
			role: "stall_member"
		});
		return new Response(JSON.stringify({
			success: true,
			member,
			redirectUrl: "/stall"
		}), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Set-Cookie": `stall_session=${encodeURIComponent(sessionData)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
			}
		});
	} catch (error) {
		console.error("Stall join error:", error);
		return new Response(JSON.stringify({ error: "Failed to join stall" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/stall/join@_@ts
var page = () => join_exports;
//#endregion
export { page };
