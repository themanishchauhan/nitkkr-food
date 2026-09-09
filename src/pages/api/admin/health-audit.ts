import type { APIRoute } from 'astro';
import { createDb, schema, getRawD1Binding } from '../../../lib/db';
import { authenticateAdminRequest } from '../../../lib/auth';
import { getActiveVendors, getAllMenuItemsForSearch, getCategories } from '../../../lib/queries';

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
    const [vendors, menuItems, categories] = await Promise.all([
      getActiveVendors().catch(() => []),
      getAllMenuItemsForSearch().catch(() => []),
      getCategories().catch(() => []),
    ]);

    const issues: Array<{
      type: 'warning' | 'error' | 'info';
      category: 'phone' | 'catalog' | 'pricing' | 'hours' | 'taxonomy';
      title: string;
      description: string;
      targetId?: number | string;
      targetName?: string;
      suggestedFix?: string;
    }> = [];

    // 1. Audit Vendors
    const vendorDishCounts: Record<number, number> = {};
    for (const item of menuItems) {
      if (item && item.vendorId) {
        vendorDishCounts[item.vendorId] = (vendorDishCounts[item.vendorId] || 0) + 1;
      }
    }

    for (const v of vendors) {
      // Check phone number length & format
      const cleanedPhone = (v.phone || '').replace(/[^0-9]/g, '');
      if (!cleanedPhone) {
        issues.push({
          type: 'error',
          category: 'phone',
          title: `Missing Phone Number`,
          description: `Vendor "${v.name}" has no contact phone number configured.`,
          targetId: v.id,
          targetName: v.name,
          suggestedFix: 'Add direct calling phone number in vendor profile'
        });
      } else if (cleanedPhone.length < 10) {
        issues.push({
          type: 'warning',
          category: 'phone',
          title: `Incomplete Phone Number (${cleanedPhone.length} digits)`,
          description: `Vendor "${v.name}" has phone number "${v.phone}" which has only ${cleanedPhone.length} digits instead of 10.`,
          targetId: v.id,
          targetName: v.name,
          suggestedFix: 'Provide complete 10-digit mobile number'
        });
      }

      // Check empty menu
      const dishCount = vendorDishCounts[v.id] || 0;
      if (dishCount === 0) {
        issues.push({
          type: 'warning',
          category: 'catalog',
          title: `Empty Menu Catalog`,
          description: `Vendor "${v.name}" is active but has 0 dishes in the campus directory.`,
          targetId: v.id,
          targetName: v.name,
          suggestedFix: 'Add dishes in Menu Dishes catalog or import items'
        });
      }

      // Check operating hours
      if (!v.opensAt || !v.closesAt) {
        issues.push({
          type: 'info',
          category: 'hours',
          title: `Unspecified Operating Hours`,
          description: `Vendor "${v.name}" does not have standard opening or closing times set.`,
          targetId: v.id,
          targetName: v.name,
          suggestedFix: 'Set standard opening and closing times'
        });
      }
    }

    // 2. Audit Menu Items
    const categoryIds = new Set(categories.map((c: any) => c.id));
    let zeroPriced = 0;
    let highPriced = 0;
    let uncategorized = 0;

    for (const item of menuItems) {
      if (!item.price || item.price <= 0) {
        zeroPriced++;
      } else if (item.price > 1000) {
        highPriced++;
      }

      if (!item.categoryId || !categoryIds.has(item.categoryId)) {
        uncategorized++;
      }
    }

    if (zeroPriced > 0) {
      issues.push({
        type: 'error',
        category: 'pricing',
        title: `${zeroPriced} Dishes with Zero or Invalid Price`,
        description: `Found ${zeroPriced} items in the campus catalog with ₹0 or negative price.`,
        suggestedFix: 'Update dish prices in Menu Catalog'
      });
    }

    if (uncategorized > 0) {
      issues.push({
        type: 'info',
        category: 'taxonomy',
        title: `${uncategorized} Uncategorized Dishes`,
        description: `Found ${uncategorized} dishes that are not mapped to any active food category.`,
        suggestedFix: 'Assign dishes to categories for better student search discovery'
      });
    }

    // Calculate overall health score (0-100)
    let score = 100;
    for (const issue of issues) {
      if (issue.type === 'error') score -= 15;
      else if (issue.type === 'warning') score -= 8;
      else if (issue.type === 'info') score -= 3;
    }
    score = Math.max(0, Math.min(100, score));

    return new Response(JSON.stringify({
      success: true,
      healthScore: score,
      status: score >= 90 ? 'EXCELLENT' : score >= 75 ? 'GOOD' : score >= 50 ? 'NEEDS_ATTENTION' : 'CRITICAL',
      stats: {
        totalVendors: vendors.length,
        totalDishes: menuItems.length,
        totalCategories: categories.length,
        issueCount: issues.length,
        errorCount: issues.filter(i => i.type === 'error').length,
        warningCount: issues.filter(i => i.type === 'warning').length,
        infoCount: issues.filter(i => i.type === 'info').length,
      },
      issues
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Health audit API error:', err);
    return new Response(JSON.stringify({
      error: 'Health audit failed',
      details: err?.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
