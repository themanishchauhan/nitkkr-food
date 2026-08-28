/**
 * In-memory Token Bucket Rate Limiter for Cloudflare Worker & Node Edge Runtime
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number;       // Maximum requests allowed in the window
  windowSeconds: number; // Time window in seconds
}

export function checkRateLimit(identifier: string, options: RateLimitOptions = { limit: 60, windowSeconds: 60 }): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: options.limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0, reset: Math.ceil(record.resetTime / 1000) };
  }

  record.count += 1;
  return { success: true, remaining: options.limit - record.count, reset: Math.ceil(record.resetTime / 1000) };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
