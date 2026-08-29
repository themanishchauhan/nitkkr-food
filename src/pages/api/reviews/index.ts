import type { APIRoute } from 'astro';
import { createDb, schema } from '../../../lib/db';
import { eq, desc, and } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../lib/auth';
import { getReviewsByMenuItem, createReview } from '../../../lib/queries';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const menuItemIdParam = url.searchParams.get('menuItemId');
    const limitParam = parseInt(url.searchParams.get('limit') || '50', 10);
    const offsetParam = parseInt(url.searchParams.get('offset') || '0', 10);

    if (menuItemIdParam) {
      const parsedId = parseInt(menuItemIdParam, 10);
      if (isNaN(parsedId)) {
        return new Response(JSON.stringify({ error: 'Invalid menuItemId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const reviews = await getReviewsByMenuItem(parsedId);
      return new Response(JSON.stringify({ reviews }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=120',
        },
      });
    }

    const db = createDb();
    const reviews = await db.select({
      id: schema.reviews.id,
      menuItemId: schema.reviews.menuItemId,
      studentName: schema.reviews.studentName,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      dishName: schema.menuItems.name,
      stallName: schema.vendors.name,
    })
      .from(schema.reviews)
      .leftJoin(schema.menuItems, eq(schema.reviews.menuItemId, schema.menuItems.id))
      .leftJoin(schema.vendors, eq(schema.menuItems.vendorId, schema.vendors.id))
      .orderBy(desc(schema.reviews.createdAt))
      .limit(limitParam)
      .offset(offsetParam);

    return new Response(JSON.stringify({ reviews: reviews || [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return new Response(JSON.stringify({ reviews: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`review:${ip}`, { limit: 10, windowSeconds: 300 });
    if (!rateLimit.success) {
      return new Response(JSON.stringify({ error: 'You are submitting reviews too fast. Please wait a few minutes.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { menuItemId, studentName, rating, comment } = body;

    if (!menuItemId || isNaN(parseInt(menuItemId, 10))) {
      return new Response(JSON.stringify({ error: 'Valid menuItemId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedItemId = parseInt(menuItemId, 10);
    const cleanedName = String(studentName || '').trim().slice(0, 50);

    if (!cleanedName) {
      return new Response(JSON.stringify({ error: 'Student name or hostel is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return new Response(JSON.stringify({ error: 'Rating must be between 1 and 5 stars' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = locals.db || createDb();

    // Check if review by this student already exists for this dish
    const existingRecent = await db.select({ id: schema.reviews.id })
      .from(schema.reviews)
      .where(and(
        eq(schema.reviews.menuItemId, parsedItemId),
        eq(schema.reviews.studentName, cleanedName)
      ))
      .limit(1);

    let reviewResult: any = null;

    if (existingRecent && existingRecent.length > 0) {
      // Update existing review seamlessly
      const existingId = existingRecent[0].id;
      const cleanComment = typeof comment === 'string' && comment.trim() ? comment.trim().slice(0, 500) : null;
      await db.update(schema.reviews)
        .set({
          rating: parsedRating,
          comment: cleanComment,
          createdAt: new Date().toISOString()
        })
        .where(eq(schema.reviews.id, existingId));

      reviewResult = {
        id: existingId,
        menuItemId: parsedItemId,
        studentName: cleanedName,
        rating: parsedRating,
        comment: cleanComment,
        createdAt: new Date().toISOString()
      };
    } else {
      // Create new review
      reviewResult = await createReview({
        menuItemId: parsedItemId,
        studentName: cleanedName,
        rating: parsedRating,
        comment: typeof comment === 'string' && comment.trim() ? comment.trim().slice(0, 500) : undefined,
      }, db);
    }

    // Set updated cookie for client tracking
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nitkkr_reviewed_items=([^;]+)/);
    const reviewedItems = match ? match[1].split(',') : [];
    const updatedReviewed = [...new Set([...reviewedItems, String(parsedItemId)])].join(',');
    const setCookie = `nitkkr_reviewed_items=${updatedReviewed}; Max-Age=2592000; Path=/; SameSite=Lax`;

    return new Response(JSON.stringify({ success: true, review: reviewResult }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setCookie,
      },
    });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to submit review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


export const DELETE: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const idParam = url.searchParams.get('id');
    if (!idParam) {
      return new Response(JSON.stringify({ error: 'Review ID required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }
    const db = createDb();
    const reviewId = parseInt(idParam, 10);
    await db.delete(schema.reviews).where(eq(schema.reviews.id, reviewId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete review' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
