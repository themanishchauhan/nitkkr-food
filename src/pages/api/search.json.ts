import type { APIRoute } from 'astro';
import { getAllMenuItemsForSearch } from '../../lib/queries';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('q')?.trim() || '';
    const category = url.searchParams.get('category')?.trim() || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const hitsPerPage = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);

    if (!query && !category) {
      return new Response(JSON.stringify({ hits: [], total: 0, query, page, hitsPerPage }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      });
    }

    const allItems = await getAllMenuItemsForSearch();
    let filtered = allItems;

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((i: any) =>
        i.name.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        i.vendorName.toLowerCase().includes(q) ||
        (i.tags && i.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    if (category) {
      filtered = filtered.filter((i: any) => i.categorySlug === category || i.categoryName === category);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / hitsPerPage);
    const start = (page - 1) * hitsPerPage;
    const hits = filtered.slice(start, start + hitsPerPage);

    return new Response(JSON.stringify({
      hits,
      total,
      query,
      page,
      hitsPerPage,
      totalPages,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ error: 'Search failed', hits: [], total: 0 }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};