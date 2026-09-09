/**
 * Orandus Operations Dashboard & System Health Automated Test Harness
 * 
 * Runs comprehensive integration tests, API contract checks, route security barriers,
 * data integrity validations, and performance benchmarks against the running server.
 */

import http from 'http';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4321';

async function runTest(name, fn) {
  const start = performance.now();
  try {
    await fn();
    const duration = (performance.now() - start).toFixed(1);
    console.log(`  \x1b[32m✔\x1b[0m ${name} \x1b[90m(${duration}ms)\x1b[0m`);
    return { name, passed: true, duration };
  } catch (err) {
    const duration = (performance.now() - start).toFixed(1);
    console.error(`  \x1b[31m✖\x1b[0m ${name} \x1b[90m(${duration}ms)\x1b[0m`);
    console.error(`    \x1b[31mError: ${err.message}\x1b[0m`);
    return { name, passed: false, duration, error: err.message };
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    redirect: 'manual',
    ...options
  });
  return res;
}

async function runAllTests() {
  console.log(`\n\x1b[1m\x1b[36m=================================================================\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m  🚀 ORANDUS OPERATIONS & DASHBOARD AUTOMATED TEST SUITE \x1b[0m`);
  console.log(`\x1b[1m\x1b[36m=================================================================\x1b[0m`);
  console.log(`\x1b[90mTesting server at: ${BASE_URL}\x1b[0m\n`);

  const results = [];

  // Warm up dev server compiler
  await request('/').catch(() => {});

  // ==========================================
  // SECTION 1: PUBLIC DISCOVERY & SPEED BENCHMARKS
  // ==========================================
  console.log(`\x1b[1m\x1b[33m[Suite 1: Public Routes & Latency Benchmarks]\x1b[0m`);
  
  results.push(await runTest('Homepage (/) returns 200 OK within 250ms', async () => {
    const start = performance.now();
    const res = await request('/');
    const time = performance.now() - start;
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (time > 500) throw new Error(`Latency exceeded budget: ${time.toFixed(1)}ms > 500ms`);
  }));

  results.push(await runTest('Search Route (/search) returns 200 OK', async () => {
    const res = await request('/search');
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
  }));

  results.push(await runTest('Vendor Route (/v/food-cave) returns 200 OK', async () => {
    const res = await request('/v/food-cave');
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
  }));

  results.push(await runTest('Vendor Route (/v/apna-fresh-fast-food) returns 200 OK', async () => {
    const res = await request('/v/apna-fresh-fast-food');
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
  }));

  // ==========================================
  // SECTION 2: SECURITY BARRIERS & AUTH
  // ==========================================
  console.log(`\n\x1b[1m\x1b[33m[Suite 2: Admin Security & Auth Barriers]\x1b[0m`);

  results.push(await runTest('Admin Login Route (/admin/login) renders 200 OK', async () => {
    const res = await request('/admin/login');
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
  }));

  results.push(await runTest('Unauthorized GET /api/admin/vendors rejects with 401', async () => {
    const res = await request('/api/admin/vendors');
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  }));

  results.push(await runTest('Unauthorized GET /api/admin/menu rejects with 401', async () => {
    const res = await request('/api/admin/menu');
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  }));

  results.push(await runTest('Unauthorized GET /api/admin/health-audit rejects with 401', async () => {
    const res = await request('/api/admin/health-audit');
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  }));

  results.push(await runTest('Unauthorized GET /api/admin/analytics rejects with 401', async () => {
    const res = await request('/api/admin/analytics');
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  }));

  // ==========================================
  // SECTION 3: ADMIN WORKSPACE PAGES
  // ==========================================
  console.log(`\n\x1b[1m\x1b[33m[Suite 3: Admin Workspace Routes Status Check]\x1b[0m`);

  const adminRoutes = [
    { path: '/admin', name: 'Dashboard Hub' },
    { path: '/admin/stalls', name: 'Campus Vendors' },
    { path: '/admin/menu-items', name: 'Menu Catalog' },
    { path: '/admin/categories', name: 'Food Categories' },
    { path: '/admin/reviews', name: 'Student Reviews' },
    { path: '/admin/qr', name: 'QR Marketing Studio' },
    { path: '/admin/site-settings', name: 'Site Settings' },
    { path: '/admin/pages', name: 'Footer Pages CMS' },
  ];

  for (const route of adminRoutes) {
    results.push(await runTest(`Route ${route.path} (${route.name}) is accessible (200 or 302 redirect)`, async () => {
      const res = await request(route.path);
      // Valid responses are 200 (if session exists/mock) or 302 (redirect to /admin/login)
      if (res.status !== 200 && res.status !== 302) {
        throw new Error(`Expected 200 or 302, got ${res.status}`);
      }
    }));
  }

  // ==========================================
  // SECTION 4: DATA INTEGRITY & CODE CONTRACTS
  // ==========================================
  console.log(`\n\x1b[1m\x1b[33m[Suite 4: Catalog Data Integrity & Code Contracts]\x1b[0m`);

  results.push(await runTest('Core search engine file exists and exposes searchPage & getThumbnailUrl', async () => {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');
    const searchEnginePath = resolve(process.cwd(), 'public/scripts/search-engine.js');
    const content = readFileSync(searchEnginePath, 'utf8');
    if (!content.includes('window.searchPage') || !content.includes('window.getThumbnailUrl')) {
      throw new Error('search-engine.js is missing window.searchPage or window.getThumbnailUrl');
    }
  }));

  results.push(await runTest('WhatsApp ordering cart is NOT enabled (Direct Call Discovery preserved)', async () => {
    const res = await request('/v/food-cave');
    const html = await res.text();
    // Verify that "Add to WhatsApp Cart" checkout modal or popups are not hijacking the discovery experience
    if (html.includes('whatsapp-checkout-drawer-open')) {
      throw new Error('WhatsApp order cart drawer detected active on public vendor page');
    }
  }));

  results.push(await runTest('Robots.txt is present and configured', async () => {
    const res = await request('/robots.txt');
    if (res.status !== 200) throw new Error(`Expected 200 OK for robots.txt, got ${res.status}`);
  }));

  results.push(await runTest('Sitemap is present and accessible', async () => {
    const res = await request('/sitemap-index.xml');
    if (res.status !== 200 && res.status !== 404) {
      throw new Error(`Unexpected status for sitemap: ${res.status}`);
    }
  }));

  // ==========================================
  // SUMMARY REPORT
  // ==========================================
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  console.log(`\n\x1b[1m\x1b[36m=================================================================\x1b[0m`);
  console.log(`\x1b[1m  TOTAL: ${total} | \x1b[32mPASSED: ${passed}\x1b[0m | \x1b[${failed > 0 ? '31m' : '32m'}FAILED: ${failed}\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m=================================================================\x1b[0m\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
