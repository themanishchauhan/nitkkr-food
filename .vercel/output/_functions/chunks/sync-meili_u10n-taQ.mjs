import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as categories, o as vendors, r as menuItems, t as db } from "./db_CTYqvQ5Q.mjs";
import { n as setupIndex, r as syncAllMenuItems } from "./meilisearch_DlBGZRBl.mjs";
import { and, eq } from "drizzle-orm";
//#region src/pages/api/sync-meili.json.ts
var sync_meili_json_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	try {
		request.headers.get("Authorization");
		await setupIndex();
		const documents = (await db.select({
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
		}).from(menuItems).innerJoin(vendors, eq(menuItems.vendorId, vendors.id)).leftJoin(categories, eq(menuItems.categoryId, categories.id)).where(and(eq(menuItems.isAvailable, true), eq(vendors.isActive, true)))).map((item) => ({
			id: item.id,
			name: item.name,
			description: item.description || "",
			price: parseFloat(item.price.toString()),
			vendorName: item.vendorName,
			vendorSlug: item.vendorSlug,
			vendorPhone: item.vendorPhone,
			vendorWhatsApp: item.vendorWhatsApp || "",
			category: item.categoryName || "",
			isVeg: item.isVeg,
			tags: item.tags || [],
			isAvailable: item.isAvailable
		}));
		await syncAllMenuItems(documents);
		return new Response(JSON.stringify({
			success: true,
			synced: documents.length
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Sync API error:", error);
		return new Response(JSON.stringify({
			error: "Sync failed",
			details: String(error)
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/sync-meili.json@_@ts
var page = () => sync_meili_json_exports;
//#endregion
export { page };
