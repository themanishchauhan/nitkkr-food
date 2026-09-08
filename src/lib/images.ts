/**
 * Modern CDN Image Optimization Helper
 * Bypasses native server-side Sharp binaries to ensure 100% compatibility with Cloudflare Pages/Workers SSR.
 * Leverages Cloudinary and Unsplash edge transformations for auto-WebP/AVIF, responsive widths, and compression.
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'limit' | 'crop';
}

/**
 * Returns an optimized image URL for Cloudinary, Unsplash, or local assets.
 */
export function getOptimizedImageUrl(rawUrl?: string | null, options: ImageOptions = {}): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '/placeholder-food.svg';
  }

  const url = rawUrl.trim();

  // Local SVGs and icons do not need raster transformation
  if (url.endsWith('.svg') || url.startsWith('/icons/') || url === '/placeholder-food.svg') {
    return url;
  }

  const width = options.width || 600;
  const quality = options.quality ?? 'auto';
  const format = options.format ?? 'auto';
  const crop = options.crop ?? 'limit';

  // 1. Cloudinary CDN Transformation
  // Example: https://res.cloudinary.com/demo/image/upload/sample.jpg
  // Transform: https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600,c_limit/sample.jpg
  if (url.includes('res.cloudinary.com')) {
    const uploadIdx = url.indexOf('/upload/');
    if (uploadIdx !== -1) {
      const prefix = url.slice(0, uploadIdx + 8);
      let suffix = url.slice(uploadIdx + 8);

      // Check if transformations already exist in the URL
      const existingTransforms = /^([a-zA-Z0-9_,]+)\//;
      if (existingTransforms.test(suffix)) {
        // Strip existing transforms to apply target responsive ones cleanly
        suffix = suffix.replace(existingTransforms, '');
      }

      const transformParts = [
        `f_${format}`,
        `q_${quality}`,
        `w_${width}`,
        `c_${crop}`
      ];
      if (options.height) {
        transformParts.push(`h_${options.height}`);
      }

      return `${prefix}${transformParts.join(',')}/${suffix}`;
    }
  }

  // 2. Unsplash CDN Transformation
  // Example: https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format...
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', String(width));
      if (options.height) {
        parsed.searchParams.set('h', String(options.height));
      }
      parsed.searchParams.set('q', quality === 'auto' ? '75' : String(quality));
      if (format !== 'auto') {
        parsed.searchParams.set('fm', format);
      }
      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  // Fallback for relative or other external URLs
  return url;
}

/**
 * Generates a responsive srcset string for an image.
 */
export function getResponsiveSrcSet(rawUrl?: string | null, widths: number[] = [320, 480, 640, 800]): string {
  if (!rawUrl || rawUrl.endsWith('.svg') || rawUrl.startsWith('/icons/')) {
    return '';
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(rawUrl, { width: w, quality: 'auto', format: 'auto' })} ${w}w`)
    .join(', ');
}
