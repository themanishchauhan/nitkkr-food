import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
//#region src/pages/500.astro
var _500_exports = /* @__PURE__ */ __exportAll({
	default: () => $$500,
	file: () => $$file,
	url: () => $$url
});
var $$500 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Server Error - NITKKR Food",
		"description": "Something went wrong on our end."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-nitkkr-cream flex items-center justify-center px-4"><div class="max-w-md w-full text-center py-12"><div class="mb-6"><span class="text-8xl" aria-hidden="true">😅</span></div><h1 class="font-display text-4xl font-bold text-nitkkr-dark mb-3">500 - Server Error</h1><p class="text-nitkkr-gray mb-6 text-lg">Something went wrong on our end. Our team has been notified.</p><div class="space-y-3"><a href="/" class="inline-block w-full px-6 py-3 bg-nitkkr-orange text-white rounded-xl font-bold hover:bg-nitkkr-orange-dark transition-colors">Back to Food Search</a><button onclick="window.location.reload()" class="inline-block w-full px-6 py-3 bg-white text-nitkkr-dark border-2 border-nitkkr-orange/30 rounded-xl font-bold hover:border-nitkkr-orange hover:bg-nitkkr-cream transition-colors">Try Again</button></div><p class="mt-8 text-xs text-nitkkr-gray">If the problem persists, please try again later or contact support.</p></div></section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/500.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/500.astro";
var $$url = "/500";
//#endregion
//#region \0virtual:astro:page:src/pages/500@_@astro
var page = () => _500_exports;
//#endregion
export { page };
