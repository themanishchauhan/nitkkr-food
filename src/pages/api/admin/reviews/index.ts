import type { APIRoute } from 'astro';
import { getAllReviews } from '../../../../lib/queries';
import { verifySessionToken } from '../../../../lib/auth';

export const prerender = false;

async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  const session = await verifySessionToken(match[1]);
  return !!session;
}

export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const reviews = await getAllReviews();
    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
