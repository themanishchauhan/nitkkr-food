import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { G as maybeRenderHead, R as renderComponent, W as renderTemplate, et as createAstro } from "./sequence_xPHSf4D-.mjs";
import { t as createComponent } from "./compiler_CWHrh6If.mjs";
import { t as $$Layout } from "./Layout_BerCxC8C.mjs";
import { n as templateExit, t as templateEnter } from "./template-depth_BPhCT68t.mjs";
//#region src/pages/stall-join.astro
var stall_join_exports = /* @__PURE__ */ __exportAll({
	default: () => $$StallJoin,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://nitkkr-food.pages.dev");
async function getStaticPaths() {
	return [];
}
var $$StallJoin = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$StallJoin;
	const token = Astro.url.searchParams.get("token");
	let error = null;
	if (token) error = null;
	else error = "Invalid or missing invite link";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Join Stall - NITKKR Food",
		"description": "Join a stall as a team member"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="min-h-screen bg-nitkkr-cream flex items-center justify-center px-4 py-12"><div class="max-w-md w-full"><div class="bg-white rounded-2xl border border-nitkkr-orange/20 shadow-sm p-8"><div class="text-center mb-8"><span class="text-5xl mb-4 block">🍜</span><h1 class="font-display text-2xl font-bold text-nitkkr-dark mb-2">Join Stall Team</h1><p class="text-nitkkr-gray">Enter your details to join as a stall member</p></div>${error && renderTemplate`<div class="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl text-center" role="alert">${error}</div>`}<template x-if="!error">${templateEnter($$result)}<form @submit.prevent="submitJoin()" class="space-y-4" x-data="joinForm()"><div x-show="loading" class="fixed inset-0 bg-white/90 flex items-center justify-center z-50" style="display: none;"><div class="bg-nitkkr-cream p-6 rounded-xl text-center"><p class="font-bold">Verifying invite...</p></div></div><div x-show="inviteValid" x-transition><div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"><p class="font-semibold text-green-800 mb-1">Invite Valid</p><p class="text-sm text-green-700" x-text="\`Joining: \${vendorName}\`"></p></div><div><label class="block text-xs font-semibold text-nitkkr-dark mb-1">Your Name *</label><input type="text" x-model="name" required placeholder="e.g. Rajesh Kumar" class="w-full px-4 py-3 bg-nitkkr-cream border border-nitkkr-orange/20 rounded-xl text-sm outline-none focus:border-nitkkr-orange"></div><div><label class="block text-xs font-semibold text-nitkkr-dark mb-1">Phone Number *</label><input type="tel" x-model="phone" required placeholder="e.g. 98765 43210" class="w-full px-4 py-3 bg-nitkkr-cream border border-nitkkr-orange/20 rounded-xl text-sm outline-none focus:border-nitkkr-orange"></div><div class="pt-4"><button type="submit" :disabled="submitting" class="w-full py-3.5 bg-nitkkr-orange hover:bg-nitkkr-orange-dark text-white font-bold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"><template x-if="submitting">${templateEnter($$result)}<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Joining...${templateExit($$result)}</template><template x-if="!submitting">${templateEnter($$result)}Join Stall Team${templateExit($$result)}</template></button></div></div><template x-if="!inviteValid &amp;&amp; !loading">${templateEnter($$result)}<div class="text-center text-nitkkr-gray"><p class="mb-4">Click the invite link sent by the stall owner</p><p class="text-xs">Link format: <code class="bg-nitkkr-cream px-1 rounded">/stall-join?token=...</code></p></div>${templateExit($$result)}</template></form>${templateExit($$result)}</template><div class="mt-6 text-center"><a href="/" class="text-xs text-nitkkr-gray hover:text-nitkkr-orange">← Back to NITKKR Food</a></div></div></div></section>` })}<script>
  function joinForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    return {
      token: token,
      name: '',
      phone: '',
      loading: false,
      submitting: false,
      inviteValid: false,
      vendorName: '',
      error: null,

      async init() {
        if (this.token) {
          await this.verifyToken();
        }
      },

      async verifyToken() {
        this.loading = true;
        try {
          const res = await fetch(\`/api/stall/verify-invite?token=\${this.token}\`);
          if (res.ok) {
            const data = await res.json();
            this.inviteValid = true;
            this.vendorName = data.vendor?.name || 'Stall';
          } else {
            this.inviteValid = false;
          }
        } catch (e) {
          console.error('Token verification failed:', e);
          this.inviteValid = false;
        } finally {
          this.loading = false;
        }
      },

      async submitJoin() {
        if (!this.name.trim() || !this.phone.trim()) return;
        this.submitting = true;
        try {
          const res = await fetch('/api/stall/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: this.token,
              name: this.name.trim(),
              phone: this.phone.trim()
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert('🎉 Welcome to the team! Redirecting to stall dashboard...');
            window.location.href = '/stall';
          } else {
            alert(data.error || 'Failed to join. Please try again.');
          }
        } catch (e) {
          console.error('Join failed:', e);
          alert('Network error. Please try again.');
        } finally {
          this.submitting = false;
        }
      }
    };
  }
<\/script>`;
}, "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/stall-join.astro", void 0);
var $$file = "/Users/manishchauhan/CHAUHAN/Business/food/nitkkr-food/src/pages/stall-join.astro";
var $$url = "/stall-join";
//#endregion
//#region \0virtual:astro:page:src/pages/stall-join@_@astro
var page = () => stall_join_exports;
//#endregion
export { page };
