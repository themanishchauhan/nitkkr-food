import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
var $$404 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Page Not Found - NITKKR Food",
		"description": "The page you're looking for doesn't exist."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-nitkkr-cream flex items-center justify-center px-4"><div class="max-w-md w-full text-center py-12"><div class="mb-6"><span class="text-8xl" aria-hidden="true">🍜</span></div><h1 class="font-display text-4xl font-bold text-nitkkr-dark mb-3">404 - Not Found</h1><p class="text-nitkkr-gray mb-6 text-lg">Sorry, we couldn't find that page. The stall might have moved or the link is stale.</p><div class="space-y-3"><a href="/" class="inline-block w-full px-6 py-3 bg-nitkkr-orange text-white rounded-xl font-bold hover:bg-nitkkr-orange-dark transition-colors">Back to Food Search</a><a href="/search" class="inline-block w-full px-6 py-3 bg-white text-nitkkr-dark border-2 border-nitkkr-orange/30 rounded-xl font-bold hover:border-nitkkr-orange hover:bg-nitkkr-cream transition-colors">Search All Stalls</a></div><p class="mt-8 text-xs text-nitkkr-gray">Looking for a specific stall? Try searching from the <a href="/" class="text-nitkkr-orange hover:underline font-medium">homepage</a>.</p></div></section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/404.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
