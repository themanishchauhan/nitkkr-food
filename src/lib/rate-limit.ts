/**
 * Pure Edge In-Memory Rate Limiter (Cloudflare Workers / SSR Safe)
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit: number;
  windowSeconds: number;
}

export function checkRateLimit(identifier: string, options: RateLimitOptions = { limit: 60, windowSeconds: 60 }): { success: boolean; remaining: number; reset: number } {
  try {
    const now = Date.now();
    const windowMs = options.windowSeconds * 1000;

    // Periodic opportunistic cleanup
    if (rateLimitStore.size > 200) {
      for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
          rateLimitStore.delete(key);
        }
      }
    }

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
  } catch (e) {
    // Fail-open gracefully if anything fails
    return { success: true, remaining: options.limit, reset: Math.ceil(Date.now() / 1000) + options.windowSeconds };
  }
}

export function getClientIp(request: Request): string {
  try {
    return (
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'
    );
  } catch (e) {
    return '127.0.0.1';
  }
}
