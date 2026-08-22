import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate, et as createAstro, q as addAttribute } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_BerCxC8C.mjs";
import { n as templateExit, t as templateEnter } from "./template-depth_BPhCT68t.mjs";
import { a as getMenuItemsByVendor, c as isVendorOpenNow, i as getCategories, s as getVendorBySlug, t as getActiveVendors } from "./queries_7ZHDMNeS.mjs";
//#region src/components/ShareButton.astro
createAstro("https://nitkkr-food.pages.dev");
var $$ShareButton = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ShareButton;
	const { url = "", title = "", text = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<button class="share-btn w-full px-4 py-2 border border-nitkkr-orange/30 text-nitkkr-orange rounded-xl font-medium
         hover:bg-nitkkr-orange/10 hover:border-nitkkr-orange transition-all duration-200
         flex items-center justify-center gap-2"${addAttribute(url, "data-url")}${addAttribute(title, "data-title")}${addAttribute(text, "data-text")} aria-label="Share" data-astro-cid-p5payz7x><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-p5payz7x><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" data-astro-cid-p5payz7x></path></svg>Share</button>${renderScript($$result, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/ShareButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/ShareButton.astro", void 0);
//#endregion
//#region src/components/CategoryTabs.astro
createAstro("https://nitkkr-food.pages.dev");
var $$CategoryTabs = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CategoryTabs;
	const { categories, menuItems } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`{ activeCat: 'all', categories: ${JSON.stringify(categories)}, menuItems: ${JSON.stringify(menuItems)} }`, "x-data")} class="mb-6"><div class="flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4 scrollbar-none" role="tablist" aria-label="Menu categories"><button @click="activeCat='all'" :class="activeCat==='all' ? 'bg-nitkkr-orange text-white' : 'bg-white text-nitkkr-gray'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-nitkkr-orange/30 transition duration-200 cursor-pointer" role="tab" :aria-selected="activeCat==='all'">All</button><template x-for="cat in categories" :key="cat.slug">${templateEnter($$result)}<button @click="activeCat=cat.slug" :class="activeCat===cat.slug ? 'bg-nitkkr-orange text-white' : 'bg-white text-nitkkr-gray'" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-nitkkr-orange/30 transition duration-200 cursor-pointer" role="tab" :aria-selected="activeCat===cat.slug"><span x-text="cat.icon" aria-hidden="true"></span><span class="ml-1" x-text="cat.name"></span></button>${templateExit($$result)}</template></div><template x-for="item in menuItems" :key="item.id">${templateEnter($$result)}<div x-show="activeCat==='all' || activeCat===item.categorySlug" x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95" class="bg-white rounded-xl border border-nitkkr-orange/20 p-4 mb-3 flex gap-4
             hover:border-nitkkr-orange/50 transition-all duration-200"><img :src="item.image || '/placeholder-food.svg'" alt="" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" loading="lazy"><div class="flex-1 min-w-0"><div class="flex items-start justify-between gap-2"><h3 class="font-semibold truncate text-nitkkr-dark" x-text="item.name"></h3><span class="text-nitkkr-orange font-bold text-lg whitespace-nowrap" x-text="'₹' + Number(item.price).toFixed(0)"></span></div><template x-if="item.description">${templateEnter($$result)}<p class="text-sm text-nitkkr-gray mt-1 line-clamp-2" x-text="item.description"></p>${templateExit($$result)}</template><div class="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-nitkkr-cream"><div class="flex flex-wrap gap-1"><template x-if="item.isVeg">${templateEnter($$result)}<span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">🌱 Veg</span>${templateExit($$result)}</template><template x-if="!item.isVeg">${templateEnter($$result)}<span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">🍗 Non-Veg</span>${templateExit($$result)}</template><template x-for="tag in (item.tags || [])" :key="tag">${templateEnter($$result)}<span class="px-2 py-0.5 bg-nitkkr-cream text-nitkkr-orange text-xs rounded-full" x-text="tag"></span>${templateExit($$result)}</template></div><button type="button" @click="window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { id: item.id, name: item.name, price: Number(item.price) } }))" class="px-3 py-1.5 bg-nitkkr-orange hover:bg-nitkkr-orange-dark text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"><span>+</span> Add</button></div></div></div>${templateExit($$result)}</template><div x-show="menuItems.length === 0 || menuItems.filter(i =&gt; activeCat==='all' || activeCat===i.categorySlug).length === 0" x-transition class="text-center py-8 text-nitkkr-gray bg-white rounded-xl border border-nitkkr-orange/20 p-6"><p class="text-lg font-bold">Nothing here yet 🤷‍♂️</p><p class="text-sm mt-1">Try another category or check back later</p></div></div>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/CategoryTabs.astro", void 0);
//#endregion
//#region src/components/CartDrawer.astro
createAstro("https://nitkkr-food.pages.dev");
var $$CartDrawer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CartDrawer;
	const { vendorName, vendorPhone, vendorWhatsApp } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div x-data="{
    open: false,
    items: [],
    roomNumber: localStorage.getItem('nitkkr_room_no') || '',
    hostel: localStorage.getItem('nitkkr_selected_hostel') || 'Hostel 4',
    
    init() {
      window.addEventListener('add-to-cart', (e) =&gt; {
        const item = e.detail;
        const existing = this.items.find(i =&gt; i.id === item.id);
        if (existing) {
          existing.qty += 1;
        } else {
          this.items.push({ ...item, qty: 1 });
        }
        this.open = true;
      });
      window.addEventListener('hostel-changed', (e) =&gt; {
        this.hostel = e.detail;
      });
    },

    saveRoom(val) {
      this.roomNumber = val;
      localStorage.setItem('nitkkr_room_no', val);
    },

    updateQty(id, delta) {
      const idx = this.items.findIndex(i =&gt; i.id === id);
      if (idx !== -1) {
        this.items[idx].qty += delta;
        if (this.items[idx].qty &lt;= 0) {
          this.items.splice(idx, 1);
        }
      }
    },

    get totalItems() {
      return this.items.reduce((acc, i) =&gt; acc + i.qty, 0);
    },

    get totalPrice() {
      return this.items.reduce((acc, i) =&gt; acc + (parseFloat(i.price) * i.qty), 0);
    },

    get whatsappUrl() {
      let text = \`Hi \${vendorName}! I'd like to order via NITKKR Food:\\n\\n\`;
      this.items.forEach(i =&gt; {
        text += \`• \${i.qty}x \${i.name} - ₹\${(parseFloat(i.price) * i.qty).toFixed(0)}\\n\`;
      });
      text += \`\\nTotal: ₹\${this.totalPrice.toFixed(0)}\`;
      text += \`\\nDelivery to: \${this.hostel}\`;
      if (this.roomNumber) {
        text += \`, Room: \${this.roomNumber}\`;
      }
      return \`https://wa.me/91\${vendorWhatsApp || vendorPhone}?text=\${encodeURIComponent(text)}\`;
    }
  }"><!-- Floating Cart Button --><button x-show="totalItems &gt; 0" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-4" x-transition:enter-end="opacity-100 translate-y-0" @click="open = true" class="fixed bottom-6 right-4 z-40 bg-nitkkr-orange text-white px-5 py-3.5 rounded-2xl shadow-xl hover:bg-nitkkr-orange-dark transition-all flex items-center gap-3 font-semibold border-2 border-white" aria-label="View order cart"><span class="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold" x-text="totalItems"></span><span>View Cart</span><span class="font-bold text-lg" x-text="\`₹\${totalPrice.toFixed(0)}\`"></span></button><!-- Slide-Over Cart Drawer --><div x-show="open" class="fixed inset-0 z-50 overflow-hidden" style="display: none;"><div x-show="open" x-transition:enter="ease-in-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in-out duration-300" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" @click="open = false"></div><div class="fixed inset-y-0 right-0 max-w-full flex pl-10"><div x-show="open" x-transition:enter="transform transition ease-in-out duration-300 sm:duration-500" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transform transition ease-in-out duration-300 sm:duration-500" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full" class="w-screen max-w-md bg-white shadow-2xl flex flex-col"><!-- Drawer Header --><div class="p-4 bg-nitkkr-cream border-b border-nitkkr-orange/20 flex items-center justify-between"><div><h2 class="font-display font-bold text-lg text-nitkkr-dark">Your Order</h2><p class="text-xs text-nitkkr-gray">${vendorName}</p></div><button @click="open = false" class="p-2 text-nitkkr-gray hover:text-nitkkr-dark text-xl font-bold">&times;</button></div><!-- Cart Items List --><div class="flex-1 overflow-y-auto p-4 space-y-3"><template x-if="items.length === 0">${templateEnter($$result)}<div class="text-center py-12 text-nitkkr-gray"><p class="text-3xl mb-2">🛒</p><p class="font-medium">Your cart is empty</p><p class="text-xs mt-1">Add items from the menu below</p></div>${templateExit($$result)}</template><template x-for="item in items" :key="item.id">${templateEnter($$result)}<div class="flex items-center justify-between p-3 bg-nitkkr-cream/50 rounded-xl border border-nitkkr-orange/10"><div class="flex-1 min-w-0 pr-3"><p class="font-semibold text-sm text-nitkkr-dark truncate" x-text="item.name"></p><p class="text-xs text-nitkkr-orange font-bold mt-0.5" x-text="\`₹\${(parseFloat(item.price) * item.qty).toFixed(0)}\`"></p></div><!-- Stepper --><div class="flex items-center gap-2 bg-white rounded-lg border border-nitkkr-orange/30 px-2 py-1"><button @click="updateQty(item.id, -1)" class="text-nitkkr-orange font-bold px-1 hover:bg-nitkkr-orange/10 rounded">-</button><span class="text-xs font-bold text-nitkkr-dark px-1" x-text="item.qty"></span><button @click="updateQty(item.id, 1)" class="text-nitkkr-orange font-bold px-1 hover:bg-nitkkr-orange/10 rounded">+</button></div></div>${templateExit($$result)}</template><!-- Delivery Details Form --><template x-if="items.length &gt; 0">${templateEnter($$result)}<div class="mt-6 p-3 bg-white rounded-xl border border-nitkkr-orange/20 space-y-2"><label class="block text-xs font-semibold text-nitkkr-dark">Delivery Address</label><div class="text-xs text-nitkkr-gray font-medium" x-text="\`Hostel: \${hostel}\`"></div><input type="text" x-model="roomNumber" @input="saveRoom($event.target.value)" placeholder="Room No (e.g. 204)" class="w-full px-3 py-2 text-xs bg-nitkkr-cream border border-nitkkr-orange/20 rounded-lg outline-none focus:border-nitkkr-orange"></div>${templateExit($$result)}</template></div><!-- Drawer Footer --><div class="p-4 border-t border-nitkkr-orange/20 bg-white space-y-3" x-show="items.length &gt; 0"><div class="flex justify-between text-sm font-bold text-nitkkr-dark"><span>Total Bill</span><span class="text-nitkkr-orange text-lg" x-text="\`₹\${totalPrice.toFixed(0)}\`"></span></div><a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.18.51-.013 1.745-.87 2.014-1.762.27-.9.07-1.653-.599-2.185C18.918 15.288 17.787 14.532 17.472 14.382z"></path></svg>Send WhatsApp Order</a></div></div></div></div></div>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/CartDrawer.astro", void 0);
//#endregion
//#region src/components/QRCodeModal.astro
createAstro("https://nitkkr-food.pages.dev");
var $$QRCodeModal = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$QRCodeModal;
	const { vendorName, vendorSlug, shareUrl } = Astro.props;
	const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&color=2B2D42&bgcolor=FFF8F0`;
	return renderTemplate`${maybeRenderHead($$result)}<div x-data="{ open: false }"><button @click="open = true" class="w-full px-4 py-2 bg-nitkkr-cream hover:bg-nitkkr-orange/10 border border-nitkkr-orange/30 text-nitkkr-dark rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-2" aria-label="Show vendor QR code for scanning"><svg class="w-4 h-4 text-nitkkr-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>Show Stall QR Code</button><div x-show="open" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style="display: none;" @click.self="open = false"><div class="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-nitkkr-orange/30"><div class="flex justify-between items-center mb-4"><h3 class="font-display font-bold text-lg text-nitkkr-dark">${vendorName} QR Code</h3><button @click="open = false" class="text-nitkkr-gray hover:text-nitkkr-dark text-xl font-bold p-1">&times;</button></div><div class="p-4 bg-nitkkr-cream rounded-xl border border-nitkkr-orange/20 inline-block mb-4 shadow-inner"><img${addAttribute(qrApiUrl, "src")}${addAttribute(`Scan QR code for ${vendorName}`, "alt")} class="w-48 h-48 mx-auto rounded-lg" loading="lazy"></div><p class="text-xs text-nitkkr-gray mb-4">Scan with any phone camera to view ${vendorName}'s live menu instantly on campus.</p><a${addAttribute(qrApiUrl, "href")}${addAttribute(`${vendorSlug}-qr.png`, "download")} target="_blank" rel="noopener noreferrer" class="w-full inline-block px-4 py-2.5 bg-nitkkr-orange text-white rounded-xl font-medium text-sm hover:bg-nitkkr-orange-dark transition-colors">Download QR Sticker</a></div></div></div>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/components/QRCodeModal.astro", void 0);
//#endregion
//#region src/pages/v/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://nitkkr-food.pages.dev");
async function getStaticPaths() {
	return (await getActiveVendors()).map((v) => ({
		params: { slug: v.slug },
		props: { vendor: v }
	}));
}
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	const vendor = Astro.props.vendor || await getVendorBySlug(slug);
	if (!vendor) return Astro.redirect("/404");
	const menuItems = await getMenuItemsByVendor(vendor.id);
	const categories = await getCategories();
	const isOpen = isVendorOpenNow(vendor.opensAt, vendor.closesAt);
	const shareUrl = new URL(`/v/${vendor.slug}`, Astro.site).href;
	const shareTitle = `${vendor.name} - NITKKR Food`;
	const shareText = `Check out ${vendor.name} - ${menuItems.length} items, opens ${vendor.opensAt}–${vendor.closesAt}`;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${vendor.name} - NITKKR Food`,
		"description": `${menuItems.length} items • ${vendor.opensAt}–${vendor.closesAt} • ${vendor.deliversTo.join(", ")}`,
		"ogImage": vendor.image || "/og-default.jpg",
		"ogUrl": shareUrl
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-nitkkr-cream pb-20"><div class="max-w-2xl mx-auto px-4 py-6"><a href="/" class="inline-flex items-center gap-2 text-nitkkr-gray hover:text-nitkkr-orange transition-colors mb-4"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>Back to Search</a><div class="card p-4 mb-4 sticky top-4 z-10"><div class="flex items-start gap-4"><img${addAttribute(vendor.image || "/placeholder-vendor.svg", "src")} alt="" class="w-20 h-20 rounded-xl object-cover flex-shrink-0"><div class="flex-1 min-w-0"><h1 class="font-display text-xl font-bold truncate text-nitkkr-dark">${vendor.name}</h1><div class="flex flex-wrap gap-3 mt-2 text-sm text-nitkkr-gray"><span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${vendor.address}</span><span class="flex items-center gap-1"${addAttribute(isOpen ? "Open now" : "Closed", "aria-label")}><span${addAttribute(`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`, "class")} aria-hidden="true"></span><span class="font-medium">${isOpen ? "Open Now" : "Closed"}</span></span></div></div></div><div class="flex gap-2 mt-4"><a${addAttribute(`https://wa.me/91${vendor.whatsapp || vendor.phone}?text=${encodeURIComponent(`Hi, I'd like to order from ${vendor.name}`)}`, "href")} target="_blank" rel="noopener noreferrer" class="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium text-sm text-center hover:bg-green-600 transition-colors flex items-center justify-center gap-2" aria-label="Order via WhatsApp"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.18.51-.013 1.745-.87 2.014-1.762.27-.9.07-1.653-.599-2.185C18.918 15.288 17.787 14.532 17.472 14.382z"></path></svg>WhatsApp</a><a${addAttribute(`tel:+91${vendor.phone}`, "href")} class="flex-1 px-4 py-3 bg-nitkkr-orange text-white rounded-xl font-medium text-sm text-center hover:bg-nitkkr-orange-dark transition-colors flex items-center justify-center gap-2" aria-label="Call vendor"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>Call</a></div><div class="grid grid-cols-2 gap-2 mt-2">${renderComponent($$result, "ShareButton", $$ShareButton, {
		"url": shareUrl,
		"title": shareTitle,
		"text": shareText
	})}${renderComponent($$result, "QRCodeModal", $$QRCodeModal, {
		"vendorName": vendor.name,
		"vendorSlug": vendor.slug,
		"shareUrl": shareUrl
	})}</div></div>${menuItems.length > 0 ? renderTemplate`${renderComponent($$result, "CategoryTabs", $$CategoryTabs, {
		"categories": categories,
		"menuItems": menuItems
	})}` : renderTemplate`<div class="card p-8 text-center text-nitkkr-gray"><p class="text-xl mb-2">No menu items yet 📭</p><p class="text-sm">Check back later or contact the vendor directly</p></div>`}</div><!-- Floating Interactive Cart Drawer -->${renderComponent($$result, "CartDrawer", $$CartDrawer, {
		"vendorName": vendor.name,
		"vendorPhone": vendor.phone,
		"vendorWhatsApp": vendor.whatsapp || vendor.phone
	})}</section>` })}`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/v/[slug].astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/v/[slug].astro";
var $$url = "/v/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/v/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
