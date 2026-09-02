import type { APIRoute } from 'astro';
import { getAllMenuItemsForSearch } from '../../lib/queries';

export const prerender = false;

function normalizePhonetics(str: string): string {
  return (str || '').toLowerCase()
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/nn/g, 'n')
    .replace(/tt/g, 't')
    .replace(/pp/g, 'p')
    .replace(/rr/g, 'r')
    .replace(/ll/g, 'l')
    .replace(/mm/g, 'm')
    .replace(/kk/g, 'k')
    .replace(/ss/g, 's')
    .replace(/zz/g, 'z')
    .replace(/ph/g, 'f')
    .replace(/bh/g, 'b')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    .replace(/sh/g, 's');
}

function levenshteinDist(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyTokenMatch(queryToken: string, targetWords: string[], fullText: string): boolean {
  if (fullText.indexOf(queryToken) !== -1) return true;

  if (queryToken.endsWith('s') && fullText.indexOf(queryToken.slice(0, -1)) !== -1) return true;
  if (queryToken.endsWith('es') && fullText.indexOf(queryToken.slice(0, -2)) !== -1) return true;

  const normQuery = normalizePhonetics(queryToken);

  for (let k = 0; k < targetWords.length; k++) {
    const word = targetWords[k];
    if (!word) continue;

    if (word.indexOf(queryToken) !== -1 || queryToken.indexOf(word) !== -1) return true;

    const normWord = normalizePhonetics(word);
    if (normWord.indexOf(normQuery) !== -1 || normQuery.indexOf(normWord) !== -1) return true;

    if (queryToken.length >= 4 && Math.abs(queryToken.length - word.length) <= 2) {
      const maxAllowedDist = queryToken.length > 5 ? 2 : 1;
      if (levenshteinDist(queryToken, word) <= maxAllowedDist) return true;
      if (levenshteinDist(normQuery, normWord) <= maxAllowedDist) return true;
    }
  }

  return false;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.trim() || '';
    const category = url.searchParams.get('category')?.trim() || '';
    const maxPrice = url.searchParams.get('maxPrice')?.trim() || '';
    const isVeg = url.searchParams.get('isVeg')?.trim() || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const hitsPerPage = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);

    const allItems = await getAllMenuItemsForSearch();
    let filtered = allItems;

    // 1. Category Filter
    if (category && category !== 'all') {
      const targetCat = category.toLowerCase();
      filtered = filtered.filter((i: any) => 
        (i.categorySlug && i.categorySlug.toLowerCase() === targetCat) || 
        (i.categoryName && i.categoryName.toLowerCase() === targetCat)
      );
    }

    // 2. Price Filter
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      const maxP = parseFloat(maxPrice);
      filtered = filtered.filter((i: any) => Number(i.price) <= maxP);
    }

    // 3. Diet Filter
    if (isVeg === 'true') {
      filtered = filtered.filter((i: any) => i.isVeg === true);
    } else if (isVeg === 'false') {
      filtered = filtered.filter((i: any) => !i.isVeg);
    }

    // 4. Tag Filter (UX-6)
    const tag = url.searchParams.get('tag')?.trim() || '';
    if (tag && tag !== 'all') {
      const targetTag = tag.toLowerCase();
      filtered = filtered.filter((i: any) => {
        let tagsArray: string[] = [];
        if (Array.isArray(i.tags)) {
          tagsArray = i.tags;
        } else if (typeof i.tags === 'string') {
          try { tagsArray = JSON.parse(i.tags); } catch { tagsArray = [i.tags]; }
        }
        return tagsArray.some(t => String(t).toLowerCase() === targetTag || String(t).toLowerCase().includes(targetTag));
      });
    }

    // 5. Keyword & Typo-Tolerant Search
    function fairInterleave(items: any[]): any[] {
      if (!items || items.length <= 1) return items;
      const vendorBuckets: Record<string, any[]> = {};
      const vendorKeys: string[] = [];
      for (const item of items) {
        const key = item.vendorSlug || item.vendorName || String(item.vendorId) || 'unknown';
        if (!vendorBuckets[key]) {
          vendorBuckets[key] = [];
          vendorKeys.push(key);
        }
        vendorBuckets[key].push(item);
      }
      for (const key of vendorKeys) {
        const bucket = vendorBuckets[key];
        for (let i = bucket.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
        }
      }
      for (let i = vendorKeys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [vendorKeys[i], vendorKeys[j]] = [vendorKeys[j], vendorKeys[i]];
      }
      const result: any[] = [];
      let added = true;
      while (added) {
        added = false;
        for (const key of vendorKeys) {
          if (vendorBuckets[key] && vendorBuckets[key].length > 0) {
            result.push(vendorBuckets[key].shift());
            added = true;
          }
        }
      }
      return result;
    }

    if (query) {
      const rawQuery = query.toLowerCase().trim();
      const tokens = rawQuery.split(/\s+/).filter(Boolean);

      filtered = filtered
        .map((item: any) => {
          const nameLower = (item.name || '').toLowerCase();
          const descLower = (item.description || '').toLowerCase();
          const vendorLower = (item.vendorName || '').toLowerCase();
          const categoryLower = (item.categoryName || '').toLowerCase();
          const tagsText = (item.tags || []).join(' ').toLowerCase();
          const fullSearchText = nameLower + ' ' + descLower + ' ' + vendorLower + ' ' + categoryLower + ' ' + tagsText;

          const targetWords = fullSearchText.split(/[\s,()\/+-]+/).filter(Boolean);

          const allTokensMatch = tokens.every((token: string) => {
            return isFuzzyTokenMatch(token, targetWords, fullSearchText);
          });

          if (!allTokensMatch) return null;

          let score = 0;
          if (nameLower === rawQuery) score += 100;
          else if (nameLower.indexOf(rawQuery) === 0) score += 50;
          else if (nameLower.indexOf(rawQuery) !== -1) score += 30;

          tokens.forEach((token: string) => {
            if (nameLower.indexOf(token) !== -1) score += 15;
            if (tagsText.indexOf(token) !== -1) score += 8;
            if (vendorLower.indexOf(token) !== -1) score += 5;
            if (descLower.indexOf(token) !== -1) score += 2;
          });

          return { item, score };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score)
        .map((entry: any) => entry.item);
    } else {
      filtered = fairInterleave(filtered);
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