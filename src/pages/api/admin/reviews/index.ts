import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../../lib/db';
import { getAllReviews } from '../../../../lib/queries';
import { authenticateAdminRequest } from '../../../../lib/auth';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
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

export const DELETE: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const idParam = url.searchParams.get('id');
    if (!idParam) {
      return new Response(JSON.stringify({ error: 'Review ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = createDb();
    const reviewId = parseInt(idParam, 10);
    await db.delete(schema.reviews).where(eq(schema.reviews.id, reviewId));

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
