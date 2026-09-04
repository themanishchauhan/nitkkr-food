import type { APIRoute } from 'astro';
import { createDb, schema, getRawD1Binding } from '../../../../lib/db';
import { eq, desc, sql, and, gte, count, sum, avg } from 'drizzle-orm';
import { authenticateAdminRequest } from '../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const admin = await authenticateAdminRequest(request);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const range = url.searchParams.get('range') || '7d';
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    const rawD1 = getRawD1Binding();
    if (!rawD1 || typeof rawD1.prepare !== 'function') {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 503, headers: { 'Content-Type': 'application/json' },
      });
    }

    const results: Record<string, any> = {};

    const vendorsRes = await rawD1.prepare(`
      SELECT id, name, slug, is_active, is_featured, opens_at, closes_at, address
      FROM vendors WHERE is_active = 1
    `).all();
    const vendors = vendorsRes.results || [];

    const menuRes = await rawD1.prepare(`
      SELECT mi.*, v.name as vendor_name, v.slug as vendor_slug, c.name as category_name
      FROM menu_items mi
      JOIN vendors v ON mi.vendor_id = v.id
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE v.is_active = 1 AND mi.is_available = 1
    `).all();
    const menuItems = menuRes.results || [];

    const reviewsRes = await rawD1.prepare(`
      SELECT r.*, mi.name as item_name, mi.vendor_id, v.name as vendor_name
      FROM reviews r
      JOIN menu_items mi ON r.menu_item_id = mi.id
      JOIN vendors v ON mi.vendor_id = v.id
      WHERE r.created_at >= ?
    `).bind(since).all();
    const reviews = reviewsRes.results || [];

    const settingsRes = await rawD1.prepare(`
      SELECT key, value FROM site_settings
    `).all();
    const settings = Object.fromEntries((settingsRes.results || []).map((r: any) => [r.key, r.value]));

    results.overview = {
      totalVendors: vendors.length,
      totalMenuItems: menuItems.length,
      totalReviews: reviews.length,
      avgRating: reviews.length > 0 
        ? (reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : '0.0',
      featuredVendors: vendors.filter(v => v.is_featured).length,
      activeCategories: [...new Set(menuItems.map((m: any) => m.category_name).filter(Boolean))].length,
    };

    results.vendorPerformance = vendors.map(v => {
      const vendorItems = menuItems.filter((m: any) => m.vendor_id === v.id);
      const vendorReviews = reviews.filter((r: any) => r.vendor_id === v.id);
      const avgRating = vendorReviews.length > 0
        ? (vendorReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / vendorReviews.length).toFixed(1)
        : '0.0';
      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        isActive: v.is_active,
        isFeatured: v.is_featured,
        totalItems: vendorItems.length,
        totalReviews: vendorReviews.length,
        avgRating,
        vegItems: vendorItems.filter((m: any) => m.is_veg).length,
        nonVegItems: vendorItems.filter((m: any) => !m.is_veg).length,
        minPrice: vendorItems.length > 0 ? Math.min(...vendorItems.map((m: any) => m.price)) : null,
        maxPrice: vendorItems.length > 0 ? Math.max(...vendorItems.map((m: any) => m.price)) : null,
        avgPrice: vendorItems.length > 0 
          ? (vendorItems.reduce((s: number, m: any) => s + m.price, 0) / vendorItems.length).toFixed(0)
          : null,
      };
    }).sort((a, b) => b.totalReviews - a.totalReviews);

    results.categoryBreakdown = Object.entries(
      menuItems.reduce((acc: Record<string, any>, m: any) => {
        const cat = m.category_name || 'Uncategorized';
        if (!acc[cat]) acc[cat] = { name: cat, count: 0, vendors: new Set(), avgPrice: 0, veg: 0, nonVeg: 0 };
        acc[cat].count++;
        acc[cat].vendors.add(m.vendor_id);
        acc[cat].avgPrice += m.price;
        if (m.is_veg) acc[cat].veg++; else acc[cat].nonVeg++;
        return acc;
      }, {})
    ).map(([name, data]) => ({
      name,
      itemCount: data.count,
      vendorCount: data.vendors.size,
      avgPrice: data.count > 0 ? (data.avgPrice / data.count).toFixed(0) : '0',
      vegPercent: data.count > 0 ? ((data.veg / data.count) * 100).toFixed(0) : '0',
    })).sort((a, b) => b.itemCount - a.itemCount);

    results.reviewsTrend = Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayReviews = reviews.filter((r: any) => r.created_at.startsWith(dateStr));
      return {
        date: dateStr,
        count: dayReviews.length,
        avgRating: dayReviews.length > 0
          ? (dayReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / dayReviews.length).toFixed(1)
          : '0.0',
      };
    });

    results.topRatedItems = menuItems
      .map((m: any) => {
        const itemReviews = reviews.filter((r: any) => r.menu_item_id === m.id);
        const avgRating = itemReviews.length > 0
          ? (itemReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / itemReviews.length).toFixed(1)
          : '0.0';
        return {
          id: m.id,
          name: m.name,
          vendorName: m.vendor_name,
          vendorSlug: m.vendor_slug,
          category: m.category_name,
          price: m.price,
          isVeg: m.is_veg,
          reviewCount: itemReviews.length,
          avgRating,
        };
      })
      .filter(m => m.reviewCount > 0)
      .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating))
      .slice(0, 10);

    results.priceDistribution = {
      under50: menuItems.filter((m: any) => m.price < 50).length,
      fiftyTo100: menuItems.filter((m: any) => m.price >= 50 && m.price < 100).length,
      hundredTo200: menuItems.filter((m: any) => m.price >= 100 && m.price < 200).length,
      above200: menuItems.filter((m: any) => m.price >= 200).length,
    };

    results.vegNonVegRatio = {
      veg: menuItems.filter((m: any) => m.is_veg).length,
      nonVeg: menuItems.filter((m: any) => !m.is_veg).length,
    };

    results.activeHours = vendors
      .filter(v => v.opens_at && v.closes_at)
      .map(v => ({
        name: v.name,
        opens: v.opens_at,
        closes: v.closes_at,
        isOpenNow: (() => {
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const [openH, openM] = v.opens_at.split(':').map(Number);
          const [closeH, closeM] = v.closes_at.split(':').map(Number);
          const openMinutes = openH * 60 + openM;
          const closeMinutes = closeH * 60 + closeM;
          return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
        })(),
      }));

    return new Response(JSON.stringify({ 
      success: true, 
      range,
      generatedAt: new Date().toISOString(),
      data: results 
    }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to fetch analytics' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};