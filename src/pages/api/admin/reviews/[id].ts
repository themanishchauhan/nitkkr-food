import type { APIRoute } from 'astro';
import { deleteReview } from '../../../../lib/queries';
import { verifySessionToken } from '../../../../lib/auth';

export const prerender = false;

async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  const session = await verifySessionToken(match[1]);
  return !!session;
}

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const id = parseInt(params.id || '', 10);
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid review ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await deleteReview(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
