import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate, et as createAstro, q as addAttribute } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
import { n as templateExit, t as templateEnter } from "./template-depth_BPhCT68t.mjs";
import { i as getCategories, r as getAllMenuItemsForSearch } from "./queries_7ZHDMNeS.mjs";
//#region src/pages/search.astro
var search_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Search,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://nitkkr-food.pages.dev");
var $$Search = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Search;
	const initialQuery = Astro.url.searchParams.get("q")?.trim() || "";
	const initialCategory = Astro.url.searchParams.get("category")?.trim() || "";
	const allItems = await getAllMenuItemsForSearch();
	const categories = await getCategories();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": initialQuery ? `Search: ${initialQuery} - NITKKR Food` : "Search Food - NITKKR Food",
		"description": "Search food items across all stalls around NITKKR"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section${addAttribute(`{
      query: ${JSON.stringify(initialQuery)},
      activeCat: ${JSON.stringify(initialCategory || "all")},
      allItems: ${JSON.stringify(allItems)},
      
      get filteredItems() {
        let list = this.allItems;
        if (this.query.trim()) {
          const q = this.query.toLowerCase().trim();
          list = list.filter(i =>
            i.name.toLowerCase().includes(q) ||
            (i.description && i.description.toLowerCase().includes(q)) ||
            i.vendorName.toLowerCase().includes(q) ||
            (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
          );
        }
        if (this.activeCat && this.activeCat !== 'all') {
          list = list.filter(i => i.categorySlug === this.activeCat || i.categoryName === this.activeCat);
        }
        return list;
      }
    }`, "x-data")} class="min-h-screen bg-nitkkr-cream"><div class="max-w-2xl mx-auto px-4 py-8"><div class="mb-6"><a href="/" class="inline-flex items-center gap-2 text-nitkkr-gray hover:text-nitkkr-orange transition-colors mb-4 text-sm font-medium"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>Back to Home</a><!-- Live Search Input --><div class="relative w-full"><input type="search" x-model="query" placeholder="Search momos, biryani, burger..." class="w-full px-6 py-4 pr-14 text-lg bg-white border-2 border-nitkkr-orange/30 rounded-2xl
                   hover:border-nitkkr-orange focus:border-nitkkr-orange focus:outline-none focus:ring-4 focus:ring-nitkkr-orange/10
                   shadow-sm transition-all duration-200" autofocus><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-nitkkr-orange hover:scale-110 transition-transform" aria-label="Search"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></div><p class="mt-3 text-xs font-semibold text-nitkkr-gray flex items-center justify-between"><span x-text="\`Found \${filteredItems.length} item\${filteredItems.length !== 1 ? 's' : ''}\`"></span><button x-show="query || activeCat !== 'all'" @click="query = ''; activeCat = 'all'" class="text-nitkkr-orange hover:underline font-bold">Clear Filters</button></p></div><!-- Category Filter Pills -->${categories.length > 0 && renderTemplate`<div class="mb-6"><div class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none" role="group" aria-label="Filter by category"><button type="button" @click="activeCat = 'all'" :class="activeCat === 'all' ? 'bg-nitkkr-orange text-white shadow-sm' : 'bg-white text-nitkkr-dark border border-nitkkr-orange/30 hover:border-nitkkr-orange'" class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer">All</button>${categories.map((cat) => renderTemplate`<button type="button"${addAttribute(`activeCat = '${cat.slug}'`, "@click")}${addAttribute(`activeCat === '${cat.slug}' ? 'bg-nitkkr-orange text-white shadow-sm' : 'bg-white text-nitkkr-dark border border-nitkkr-orange/30 hover:border-nitkkr-orange'`, ":class")} class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5"><span aria-hidden="true">${cat.icon}</span><span>${cat.name}</span></button>`)}</div></div>`}<!-- Dynamic Filtered Results --><div class="space-y-3" role="list" aria-label="Search results"><template x-for="item in filteredItems" :key="item.id">${templateEnter($$result)}<article class="card p-4 flex gap-4 bg-white rounded-2xl border border-nitkkr-orange/20 hover:border-nitkkr-orange hover:shadow-md transition-all" role="listitem"><img :src="item.image || '/placeholder-food.svg'" alt="" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" loading="lazy"><div class="flex-1 min-w-0"><div class="flex items-start justify-between gap-2"><div><h3 class="font-bold text-nitkkr-dark truncate" x-text="item.name"></h3><p class="text-xs text-nitkkr-gray mt-0.5 flex items-center gap-1"><span aria-hidden="true">🏪</span><a :href="\`/v/\${item.vendorSlug}\`" class="hover:text-nitkkr-orange font-medium transition-colors" x-text="item.vendorName"></a><span class="text-nitkkr-orange/70" x-text="item.categoryName ? \`· \${item.categoryName}\` : ''"></span></p></div><span class="text-nitkkr-orange font-bold text-lg whitespace-nowrap" x-text="\`₹\${Number(item.price).toFixed(0)}\`"></span></div><p class="text-xs text-nitkkr-gray mt-1 line-clamp-2" x-text="item.description || ''"></p><div class="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-nitkkr-cream"><div class="flex flex-wrap gap-1"><span x-show="item.isVeg" class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">🌱 Veg</span><span x-show="!item.isVeg" class="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">🍗 Non-Veg</span><template x-for="tag in (item.tags || [])" :key="tag">${templateEnter($$result)}<span class="px-2 py-0.5 bg-nitkkr-cream text-nitkkr-orange text-[10px] font-medium rounded-full" x-text="tag"></span>${templateExit($$result)}</template></div><a :href="\`/v/\${item.vendorSlug}\`" class="px-3 py-1.5 bg-nitkkr-orange/10 hover:bg-nitkkr-orange hover:text-white text-nitkkr-orange rounded-lg font-bold text-xs transition-colors">View Stall →</a></div></div></article>${templateExit($$result)}</template><div x-show="filteredItems.length === 0" class="text-center py-16 text-nitkkr-gray bg-white rounded-2xl border border-nitkkr-orange/20 p-8"><p class="text-3xl mb-2">🔍</p><p class="text-lg font-bold text-nitkkr-dark">No items found matching your filters</p><p class="text-xs text-nitkkr-gray mt-1">Try typing a different keyword or selecting "All" categories above.</p></div></div></div></section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/search.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/search.astro";
var $$url = "/search";
//#endregion
//#region \0virtual:astro:page:src/pages/search@_@astro
var page = () => search_exports;
//#endregion
export { page };
