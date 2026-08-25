import type { APIRoute } from 'astro';
import { createSessionToken, verifySessionToken } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { username, password, pin } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expectedUsername = (process.env.ADMIN_USERNAME || import.meta.env.ADMIN_USERNAME || 'manishchauhan').trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || import.meta.env.ADMIN_PASSWORD_HASH || '';
    const expectedPin = process.env.ADMIN_PIN || import.meta.env.ADMIN_PIN || '';

    // 1. Verify Username
    if (username.trim().toLowerCase() !== expectedUsername) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Verify Security PIN (if configured)
    if (expectedPin && String(pin || '').trim() !== expectedPin.trim()) {
      return new Response(JSON.stringify({ error: 'Invalid Security PIN' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Verify Password
    if (expectedPassword) {
      if (password !== expectedPassword) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (adminPasswordHash) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'nitkkr-salt-2024');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashedInput !== adminPasswordHash) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const token = await createSessionToken('1', expectedUsername);


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

  return new Response(JSON.stringify({ authenticated: true, username: 'manishchauhan' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};