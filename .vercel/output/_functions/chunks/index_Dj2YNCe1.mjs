import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate, et as createAstro, q as addAttribute } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
import { c as isVendorOpenNow, i as getCategories, o as getMinPrice, t as getActiveVendors } from "./queries_7ZHDMNeS.mjs";
//#region src/components/SearchBar.astro
createAstro("https://nitkkr-food.pages.dev");
var $$SearchBar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SearchBar;
	const { placeholder = "What are you craving? momos, biryani, burger...", autoFocus = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<form action="/search" method="GET" class="w-full" role="search"><label for="search-input" class="sr-only">Search food</label><div class="relative"><input type="search" id="search-input" name="q"${addAttribute(placeholder, "placeholder")} class="w-full px-6 py-4 pr-14 text-lg bg-white border-2 border-nitkkr-orange/30 rounded-2xl
             focus:outline-none focus:border-nitkkr-orange focus:ring-2 focus:ring-nitkkr-orange/20
             placeholder:text-nitkkr-gray"${addAttribute(autoFocus, "autofocus")} autocomplete="off" aria-label="Search food items"><button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-nitkkr-orange hover:text-nitkkr-orange-dark transition-colors" aria-label="Search"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></div></form>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/SearchBar.astro", void 0);
//#endregion
//#region src/components/FilterChips.astro
createAstro("https://nitkkr-food.pages.dev");
var $$FilterChips = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FilterChips;
	const { chips = [
		{
			label: "Momos & Chinese",
			icon: "🥢",
			query: "momo"
		},
		{
			label: "Under ₹100",
			icon: "💰",
			query: "100"
		},
		{
			label: "Pure Veg",
			icon: "🌱",
			query: "veg"
		},
		{
			label: "Late Night",
			icon: "🌙",
			query: "late night"
		},
		{
			label: "Shakes & Chai",
			icon: "🧋",
			query: "shake"
		}
	] } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="flex overflow-x-auto gap-2 pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-none" role="group" aria-label="Quick filters">${chips.map((chip) => renderTemplate`<a${addAttribute(`/search?q=${encodeURIComponent(chip.query)}`, "href")} class="px-3.5 py-2 bg-white border border-nitkkr-orange/30 text-nitkkr-dark rounded-full text-xs font-semibold
             hover:bg-nitkkr-orange hover:text-white hover:border-nitkkr-orange shadow-xs transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95"><span aria-hidden="true">${chip.icon}</span><span>${chip.label}</span></a>`)}</div>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/FilterChips.astro", void 0);
//#endregion
//#region src/components/VendorCard.astro
createAstro("https://nitkkr-food.pages.dev");
var $$VendorCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$VendorCard;
	const { vendor, isOpen } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`/v/${vendor.slug}`, "href")} class="flex items-center gap-4 bg-white p-3 rounded-xl border border-nitkkr-orange/20
         hover:border-nitkkr-orange hover:shadow-lg transition-all duration-200"><img${addAttribute(vendor.image || "/placeholder-vendor.svg", "src")} alt="" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy"><div class="flex-1 min-w-0"><p class="font-semibold truncate text-nitkkr-dark">${vendor.name}</p><p class="text-xs text-nitkkr-gray flex items-center gap-1 mt-0.5"><span${addAttribute(`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`, "class")} aria-hidden="true"></span><span class="truncate">${isOpen ? "Open Now" : "Closed"} (${vendor.opensAt} – ${vendor.closesAt})</span></p></div>${vendor.minPrice && renderTemplate`<span class="text-nitkkr-orange font-bold text-lg whitespace-nowrap">₹${vendor.minPrice}</span>`}</a>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/VendorCard.astro", void 0);
//#endregion
//#region src/components/CategoryCard.astro
createAstro("https://nitkkr-food.pages.dev");
var $$CategoryCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CategoryCard;
	const { category } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`/search?category=${category.slug}`, "href")} class="bg-white p-3 sm:p-4 rounded-2xl border border-nitkkr-orange/20 text-center
         hover:border-nitkkr-orange hover:shadow-md active:scale-95 transition-all duration-200 flex flex-col items-center justify-center min-w-[90px] sm:min-w-0"><span class="text-2xl sm:text-3xl block mb-1" aria-hidden="true">${category.icon}</span><span class="font-bold text-xs sm:text-sm text-nitkkr-dark leading-tight line-clamp-2">${category.name}</span></a>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/CategoryCard.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const vendors = await getActiveVendors();
	const categories = await getCategories();
	const vendorsWithStatus = await Promise.all(vendors.map(async (v) => ({
		...v,
		isOpen: isVendorOpenNow(v.opensAt, v.closesAt),
		minPrice: await getMinPrice(v.id)
	})));
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "NITKKR Food - Find Food Around Campus Instantly",
		"description": "Search 20+ food stalls around NIT Kurukshetra. View menus, prices, and order via WhatsApp or call directly."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-gradient-to-b from-nitkkr-cream to-white pb-12"><div class="max-w-2xl mx-auto px-4 py-6 sm:py-12"><!-- Compact Hero Section --><div class="text-center mb-6"><h1 class="font-display text-3xl sm:text-5xl font-bold text-nitkkr-dark mb-1 leading-tight">Hungry? We got you. <span class="text-nitkkr-orange" aria-hidden="true">🍜</span></h1><p class="text-nitkkr-gray text-xs sm:text-base font-medium">Search 20+ food stalls around NITKKR</p></div>${renderComponent($$result, "SearchBar", $$SearchBar, {
		"placeholder": "What are you craving? momos, biryani...",
		"autoFocus": true
	})}${renderComponent($$result, "FilterChips", $$FilterChips, {})}<!-- Categories Section --><div class="mb-10"><h2 class="font-display text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-nitkkr-dark"><span class="text-nitkkr-orange" aria-hidden="true">🍽️</span>Browse by Category</h2><div class="grid grid-cols-4 gap-2 sm:gap-3">${categories.map((cat) => renderTemplate`${renderComponent($$result, "CategoryCard", $$CategoryCard, { "category": cat })}`)}</div></div><!-- Stall Listings Section --><div><div class="flex items-center justify-between mb-4"><h2 class="font-display text-lg sm:text-xl font-bold flex items-center gap-2 text-nitkkr-dark">Campus Stalls & Eateries<span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span></h2><span class="text-xs text-nitkkr-gray font-medium">${vendorsWithStatus.length} stalls</span></div><div class="space-y-2.5 sm:space-y-3">${vendorsWithStatus.map((v) => renderTemplate`${renderComponent($$result, "VendorCard", $$VendorCard, {
		"vendor": v,
		"isOpen": v.isOpen
	})}`)}</div></div></div></section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/index.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
