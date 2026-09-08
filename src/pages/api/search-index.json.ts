import type { APIRoute } from 'astro';
import { getAllMenuItemsForSearch, getActiveVendors } from '../../lib/queries';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const [items, vendors] = await Promise.all([
      getAllMenuItemsForSearch(),
      getActiveVendors()
    ]);

    return new Response(JSON.stringify({ items, vendors }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    });
  } catch (err: any) {
    console.error('Failed to generate search index:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate search index' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
