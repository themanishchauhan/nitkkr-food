import { n as defineMiddleware, t as sequence } from "./chunks/sequence_xPHSf4D-.mjs";
defineMiddleware(async ({ error, url, locals, redirect }, next) => {
	console.error(`[Error] ${url.pathname}:`, error);
	return new Response(null, { status: 500 });
});
var onRequest$1 = defineMiddleware(async ({ request, url, redirect }, next) => {
	const response = await next();
	if (response.status === 404) return redirect("/404");
	return response;
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
