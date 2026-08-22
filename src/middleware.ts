import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const response = await next();
    return response;
  } catch (error) {
    console.error(`[Middleware Error] ${context.url.pathname}:`, error);
    return new Response('Server Error', { status: 500 });
  }
});