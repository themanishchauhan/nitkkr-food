import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as getAllMenuItemsForSearch } from "./queries_7ZHDMNeS.mjs";
import { t as searchMenuItems } from "./meilisearch_DlBGZRBl.mjs";
//#region src/pages/api/search.json.ts
var search_json_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ url }) => {
	try {
		const query = url.searchParams.get("q")?.trim() || "";
		const category = url.searchParams.get("category")?.trim() || "";
		const page = parseInt(url.searchParams.get("page") || "1", 10);
		const hitsPerPage = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);
		if (!query && !category) return new Response(JSON.stringify({
			hits: [],
			total: 0,
			query,
			page,
			hitsPerPage
		}), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=60"
			}
		});
		try {
			const filterParts = ["isAvailable = true"];
			if (category) filterParts.push(`category = "${category}"`);
			const results = await searchMenuItems(query, {
				filter: filterParts.join(" AND "),
				hitsPerPage,
				page: page - 1
			});
			return new Response(JSON.stringify({
				hits: results.hits,
				total: results.estimatedTotalHits,
				query,
				page,
				hitsPerPage,
				totalPages: Math.ceil(results.estimatedTotalHits / hitsPerPage)
			}), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, max-age=60"
				}
			});
		} catch (meiliError) {
			let filtered = await getAllMenuItemsForSearch();
			if (query) {
				const q = query.toLowerCase();
				filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || i.description && i.description.toLowerCase().includes(q) || i.vendorName.toLowerCase().includes(q));
			}
			if (category) filtered = filtered.filter((i) => i.categorySlug === category || i.categoryName === category);
			return new Response(JSON.stringify({
				hits: filtered,
				total: filtered.length,
				query,
				page: 1,
				hitsPerPage: filtered.length,
				totalPages: 1
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}
	} catch (error) {
		console.error("Search API error:", error);
		return new Response(JSON.stringify({
			error: "Search failed",
			hits: [],
			total: 0
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/search.json@_@ts
var page = () => search_json_exports;
//#endregion
export { page };
