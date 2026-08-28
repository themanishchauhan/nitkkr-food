import type { APIRoute } from 'astro';
import { createSessionToken, verifySessionToken, verifyAdminCredentials } from '../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rateLimit.success) {
      return new Response(JSON.stringify({ error: 'Too many login attempts. Please try again in 1 minute.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.reset - Math.floor(Date.now() / 1000)),
        },
      });
    }

    const body = await request.json();
    const { username, password, pin } = body;


    if (!username?.trim() || !password?.trim()) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expectedPin = (process.env.ADMIN_PIN || (globalThis as any)?.__CF_ENV__?.ADMIN_PIN || '').trim();

    // 1. Verify Security PIN (if configured)
    if (expectedPin && String(pin || '').trim() !== expectedPin) {
      return new Response(JSON.stringify({ error: 'Invalid Security PIN' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Strict Password Verification (SEC-2 & SEC-3)
    const isValid = await verifyAdminCredentials(username.trim(), password.trim());
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await createSessionToken('1', username.trim().toLowerCase());

    cookies.set('admin_session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 604800,
      secure: import.meta.env.PROD,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('admin_session', { path: '/' });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ authenticated: true, username: session.username }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};