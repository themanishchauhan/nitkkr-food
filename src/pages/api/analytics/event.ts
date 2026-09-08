import type { APIRoute } from 'astro';
import { recordAnalyticsEvent } from '../../../lib/queries';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { eventType, vendorId, source, medium, campaign, metadata } = body;
    if (!eventType || typeof eventType !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing eventType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Record the event asynchronously
    await recordAnalyticsEvent({
      eventType: eventType.slice(0, 50),
      vendorId: vendorId ? Number(vendorId) : null,
      source: typeof source === 'string' ? source.slice(0, 50) : null,
      medium: typeof medium === 'string' ? medium.slice(0, 50) : null,
      campaign: typeof campaign === 'string' ? campaign.slice(0, 100) : null,
      metadata: metadata || null,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Analytics event ingest error:', error);
    return new Response(JSON.stringify({ error: 'Failed to record event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
