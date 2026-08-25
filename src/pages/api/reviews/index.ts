import type { APIRoute } from 'astro';
import { createReview, getReviewsByMenuItem, getReviewsByVendor } from '../../../lib/queries';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const menuItemIdParam = url.searchParams.get('menuItemId');
    const vendorIdParam = url.searchParams.get('vendorId');

    if (menuItemIdParam) {
      const menuItemId = parseInt(menuItemIdParam, 10);
      if (!menuItemId || isNaN(menuItemId)) {
        return new Response(JSON.stringify({ error: 'Invalid menuItemId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const reviews = await getReviewsByMenuItem(menuItemId);
      return new Response(JSON.stringify({ reviews }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (vendorIdParam) {
      const vendorId = parseInt(vendorIdParam, 10);
      if (!vendorId || isNaN(vendorId)) {
        return new Response(JSON.stringify({ error: 'Invalid vendorId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const reviews = await getReviewsByVendor(vendorId);
      return new Response(JSON.stringify({ reviews }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'menuItemId or vendorId required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reviews' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { menuItemId, studentName, rating, comment } = body;

    if (!menuItemId || isNaN(parseInt(menuItemId, 10))) {
      return new Response(JSON.stringify({ error: 'Valid menuItemId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedItemId = parseInt(menuItemId, 10);

    // Cookie-based Deduplication Check
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nitkkr_reviewed_items=([^;]+)/);
    const reviewedItems = match ? match[1].split(',') : [];

    if (reviewedItems.includes(String(parsedItemId))) {
      return new Response(JSON.stringify({ error: 'You have already reviewed this dish! Thank you for your feedback.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!studentName || typeof studentName !== 'string' || !studentName.trim()) {
      return new Response(JSON.stringify({ error: 'Student name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return new Response(JSON.stringify({ error: 'Rating must be between 1 and 5' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const review = await createReview({
      menuItemId: parsedItemId,
      studentName: studentName.trim().slice(0, 50),
      rating: parsedRating,
      comment: typeof comment === 'string' ? comment.trim().slice(0, 500) : undefined,
    });

    // Update reviewed items cookie
    const updatedReviewed = [...new Set([...reviewedItems, String(parsedItemId)])].join(',');
    const setCookie = `nitkkr_reviewed_items=${updatedReviewed}; Max-Age=2592000; Path=/; SameSite=Lax`;

    return new Response(JSON.stringify({ success: true, review }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookie,
      },
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
