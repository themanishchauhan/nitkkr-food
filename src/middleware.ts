import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // 1. Capture Cloudflare Workers runtime environment and store DB globally for queries
    const cfEnv = (context.locals as any)?.runtime?.env;
    if (cfEnv) {
      (globalThis as any).__CF_ENV__ = cfEnv;
      if (cfEnv.DB) {
        (globalThis as any).DB = cfEnv.DB;
      }
    }

    const url = new URL(context.request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    // 2. Skip auth for login pages and auth API endpoint
    if (path === '/ops-manish-770' || path === '/admin/login' || path.startsWith('/api/admin/auth')) {
      return next();
    }

    // Forward legacy /admin/settings to /admin/site-settings
    if (path === '/admin/settings') {
      return context.redirect('/admin/site-settings', 302);
    }

    if (path.startsWith('/admin')) {
      const cookieHeader = context.request.headers.get('cookie') || '';
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      const token = match ? match[1] : (context.cookies.get('admin_session')?.value || null);

      if (!token) {
        return context.redirect('/admin/login', 302);
      }

      const session = await verifySessionToken(token);
      if (!session) {
        return context.redirect('/admin/login', 302);
      }

      // Add user info to locals for use in components
      context.locals.admin = session;
    }


    // 4. Protect all /api/admin API routes
    if (path.startsWith('/api/admin')) {
      const cookieHeader = context.request.headers.get('cookie') || '';
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      const token = match ? match[1] : (context.cookies.get('admin_session')?.value || null);

      if (!token || !(await verifySessionToken(token))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return next();
  } catch (err) {
    console.error('Unhandled middleware error:', err);
    return next();
  }
});