/**
 * Shared Search & Item Classification Utilities
 * Used by both server (Astro API / SSR) and client (search engine & category tabs).
 */

export const STOP_WORDS = new Set(['in', 'on', 'at', 'to', 'of', 'for', 'with', 'a', 'an', 'the', 'and', 'or', 'is', 'by', 'as']);

/**
 * Normalizes phonetic variations common in Indian food items (Hinglish/English).
 */
export function normalizePhonetics(str: string = ''): string {
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

/**
 * Standard Levenshtein distance calculation.
 */
export function levenshteinDist(a: string, b: string): number {
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

/**
 * Unified Diet Detection
 * Categorizes an item as 'veg', 'egg', or 'nonveg' based on name, description, tags, and isVeg flag.
 */
export function detectDiet(item: any): 'veg' | 'egg' | 'nonveg' {
  if (!item) return 'veg';
  const name = (item.name || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const rawTags = Array.isArray(item.tags)
    ? item.tags
    : (typeof item.tags === 'string' ? [item.tags] : []);
  const tagsText = rawTags.join(' ').toLowerCase();
  const full = `${name} ${desc} ${tagsText}`;

  const isMeat = /chicken|mutton|fish|prawn|kebab|kabab|keema|meat|tangri|kalmi|seekh|basa/i.test(full);
  const hasEgg = /\b(egg|eggs|anda|omelet|omelette|french toast|boiled egg)\b/i.test(full) || /\b(egg\s+bhurji|anda\s+bhurji)\b/i.test(full);
  const isExplicitlyVeg = /\b(paneer|soya|tofu|dal|mushroom|aloo|gobi|chole|rajma|veg)\b/i.test(name) && !/\b(egg|eggs|anda|chicken|mutton|fish|meat)\b/i.test(name);

  if (isExplicitlyVeg && !isMeat && !hasEgg) return 'veg';
  if (hasEgg && !isMeat) return 'egg';
  if (isMeat || item.isVeg === false || item.isVeg === 0) {
    return isMeat ? 'nonveg' : (hasEgg ? 'egg' : 'nonveg');
  }
  return 'veg';
}

/**
 * Pre-indexes an item's search tokens into a normalized string for fast $<1ms keystroke checks.
 */
export function prepareSearchTokens(item: any): string {
  const name = (item.name || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const cat = (item.categoryName || item.categorySlug || '').toLowerCase();
  const rawTags = Array.isArray(item.tags)
    ? item.tags
    : (typeof item.tags === 'string' ? [item.tags] : []);
  const tagsText = rawTags.join(' ').toLowerCase();
  const vName = (item.vendorName || '').toLowerCase();

  return `${name} ${cat} ${tagsText} ${vName} ${desc}`;
}

/**
 * Fair round-robin interleaving by vendor.
 */
export function fairInterleaveByVendor<T extends Record<string, any>>(items: T[]): T[] {
  if (!items || items.length <= 1) return items;

  const vendorBuckets: Record<string, T[]> = {};
  const vendorKeys: string[] = [];

  for (const item of items) {
    const key = item.vendorSlug || item.vendorName || String(item.vendorId) || 'unknown';
    if (!vendorBuckets[key]) {
      vendorBuckets[key] = [];
      vendorKeys.push(key);
    }
    vendorBuckets[key].push(item);
  }

  // Shuffle vendor order for balanced exposure
  for (let i = vendorKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = vendorKeys[i];
    vendorKeys[i] = vendorKeys[j];
    vendorKeys[j] = temp;
  }

  const result: T[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const vKey of vendorKeys) {
      if (vendorBuckets[vKey] && vendorBuckets[vKey].length > 0) {
        result.push(vendorBuckets[vKey].shift()!);
        added = true;
      }
    }
  }
  return result;
}
