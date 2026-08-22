import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { o as vendors, t as db } from "./db_CTYqvQ5Q.mjs";
import { i as addVendorToMock } from "./mock-data_DapPhx2P.mjs";
//#region src/pages/api/vendors/create.json.ts
var create_json_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	try {
		const { name, phone, address, opensAt, closesAt, whatsapp, deliversTo } = await request.json();
		if (!name || !phone || !address) return new Response(JSON.stringify({ error: "Name, phone, and address are required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "new-stall";
		const vendorData = {
			id: Date.now(),
			name,
			slug,
			phone: phone || "9876543210",
			whatsapp: whatsapp || phone || "9876543210",
			address: address || "NITKKR Campus",
			opensAt: opensAt || "09:00",
			closesAt: closesAt || "23:00",
			isActive: true,
			isFeatured: false,
			deliversTo: deliversTo || ["All Hostels & Locations"],
			displayOrder: 99,
			image: "/placeholder-vendor.svg"
		};
		if (process.env.DATABASE_URL) try {
			await db.insert(vendors).values({
				name: vendorData.name,
				slug: vendorData.slug,
				phone: vendorData.phone,
				whatsapp: vendorData.whatsapp,
				address: vendorData.address,
				opensAt: vendorData.opensAt,
				closesAt: vendorData.closesAt,
				isActive: true,
				isFeatured: false,
				deliversTo: vendorData.deliversTo,
				displayOrder: 99,
				image: vendorData.image
			});
		} catch (dbErr) {
			console.warn("DB insert fallback to mock store:", dbErr);
			addVendorToMock(vendorData);
		}
		else addVendorToMock(vendorData);
		return new Response(JSON.stringify({
			success: true,
			vendor: vendorData
		}), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Create vendor API error:", error);
		return new Response(JSON.stringify({
			error: "Failed to create vendor",
			details: String(error)
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/vendors/create.json@_@ts
var page = () => create_json_exports;
//#endregion
export { page };
