import { J as createRenderInstruction, K as renderHead, V as renderSlot, W as renderTemplate, et as createAstro, q as addAttribute } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://nitkkr-food.pages.dev");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "NITKKR Food", description = "Find food around NIT Kurukshetra instantly", ogImage = "/og-default.jpg", ogUrl = Astro.url.href } = Astro.props;
	const canonicalURL = new URL(Astro.url.pathname, Astro.site);
	return renderTemplate`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#FF6B35"><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icons/icon-192.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(ogUrl, "content")}><meta property="og:type" content="website"><meta property="og:image"${addAttribute(new URL(ogImage, Astro.site).href, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(new URL(ogImage, Astro.site).href, "content")}>${renderHead($$result)}</head><body class="font-body bg-nitkkr-cream text-nitkkr-dark min-h-screen flex flex-col"><div id="toast-container" class="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite"></div><main class="flex-1">${renderSlot($$result, $$slots["default"])}</main><footer class="border-t border-nitkkr-orange/20 py-6 mt-auto"><div class="max-w-4xl mx-auto px-4 text-center text-sm text-nitkkr-gray flex flex-col sm:flex-row items-center justify-between gap-3"><p>Made with ❤️ for NITKKR students</p><a href="/admin" class="px-3 py-1.5 bg-nitkkr-orange/10 hover:bg-nitkkr-orange hover:text-white text-nitkkr-orange rounded-xl font-bold text-xs transition-colors flex items-center gap-1"><span>⚙️</span> Stall Owner Dashboard</a></div></footer>${renderScript($$result, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/layouts/Layout.astro", void 0);
//#endregion
export { renderScript as n, $$Layout as t };
