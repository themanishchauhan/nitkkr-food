import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
//#region src/pages/offline.astro
var offline_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Offline,
	file: () => $$file,
	url: () => $$url
});
var $$Offline = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Offline - NITKKR Food",
		"description": "You're offline. Some features may be limited."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-nitkkr-cream flex items-center justify-center px-4"><div class="max-w-md w-full text-center py-12"><div class="mb-6"><span class="text-8xl" aria-hidden="true">📱</span></div><h1 class="font-display text-4xl font-bold text-nitkkr-dark mb-3">You're Offline</h1><p class="text-nitkkr-gray mb-6 text-lg">No internet connection detected. Some features may not work.</p><div class="space-y-3"><button onclick="window.location.reload()" class="inline-block w-full px-6 py-3 bg-nitkkr-orange text-white rounded-xl font-bold hover:bg-nitkkr-orange-dark transition-colors">Try Reconnecting</button><a href="/" class="inline-block w-full px-6 py-3 bg-white text-nitkkr-dark border-2 border-nitkkr-orange/30 rounded-xl font-bold hover:border-nitkkr-orange hover:bg-nitkkr-cream transition-colors">Go Home (Cached)</a></div><p class="mt-8 text-xs text-nitkkr-gray">Previously loaded stalls and menus may still be accessible.</p></div></section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/offline.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/offline.astro";
var $$url = "/offline";
//#endregion
//#region \0virtual:astro:page:src/pages/offline@_@astro
var page = () => offline_exports;
//#endregion
export { page };
