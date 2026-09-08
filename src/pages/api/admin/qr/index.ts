import type { APIRoute } from 'astro';
import { authenticateAdminRequest } from '../../../../lib/auth';
import { getQrAnalyticsData } from '../../../../lib/queries';

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
    const data = await getQrAnalyticsData();
    return new Response(JSON.stringify({ success: true, ...data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Admin QR analytics error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch QR analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
