import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Skip auth for secret login page and auth API endpoint
  if (url.pathname === '/ops-manish-770' || url.pathname === '/admin/login' || url.pathname.startsWith('/api/admin/auth')) {
    return next();
  }

  // Protect all /admin UI pages - redirect unauthenticated visitors to homepage (hides admin existence)
  if (url.pathname.startsWith('/admin')) {
    const cookieHeader = context.request.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    const token = match ? match[1] : (context.cookies.get('admin_session')?.value || null);

    if (!token) {
      return context.redirect('/');
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return context.redirect('/');
    }

    // Add user info to locals for use in components
    context.locals.admin = session;
  }


  // Protect all /api/admin API routes
  if (url.pathname.startsWith('/api/admin')) {
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
});