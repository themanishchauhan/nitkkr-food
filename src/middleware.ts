import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';
import { createDb, setActiveD1 } from './lib/db';

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // 1. Capture Cloudflare Workers runtime environment and store DB in request-scoped locals (SEC-5 fix)
    const cfEnv = (context.locals as any)?.runtime?.env;
    if (cfEnv?.DB) {
      setActiveD1(cfEnv.DB);
      context.locals.db = createDb(cfEnv);
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

    return next();
  } catch (error) {
    console.error('Middleware error:', error);
    return next();
  }
});