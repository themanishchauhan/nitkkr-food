// Simple password hashing using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'nitkkr-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// Base64URL Helpers with Buffer fallback for Node/Vite SSR & Web Crypto compatibility
function base64UrlEncode(input: string | Uint8Array | ArrayBuffer): string {
  if (typeof Buffer !== 'undefined') {
    const buf = typeof input === 'string' 
      ? Buffer.from(input, 'utf-8') 
      : Buffer.from(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
    return buf.toString('base64url');
  }
  let b64 = '';
  if (typeof input === 'string') {
    b64 = btoa(input);
  } else if (input instanceof Uint8Array) {
    // Properly encode Uint8Array to base64url
    b64 = Buffer.from(input).toString('base64url');
  } else {
    const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : new Uint8Array(input);
    b64 = btoa(String.fromCharCode(...bytes));
  }
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecodeToBytes(b64url: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64url, 'base64url'));
  }
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlDecodeToString(b64url: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64url, 'base64url').toString('utf-8');
  }
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  return atob(b64);
}

const JWT_SECRET_BYTES = new TextEncoder().encode('nitkkr-jwt-secret-2024-change-in-production');

async function getHmacKey() {
  return await crypto.subtle.importKey(
    'raw',
    JWT_SECRET_BYTES,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// JWT Token Creation
export async function createSessionToken(userId: string, username: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: userId,
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signatureData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign('HMAC', key, signatureData);
  const signatureB64 = base64UrlEncode(signature);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// JWT Token Verification
export async function verifySessionToken(token: string): Promise<{ userId: string; username: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const signatureData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecodeToBytes(signatureB64);

    const key = await getHmacKey();
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, signatureData);

    if (!valid) return null;

    const payloadJson = base64UrlDecodeToString(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { userId: payload.sub, username: payload.username };
  } catch (err) {
    console.error('Session token verification error:', err);
    return null;
  }
}

export async function getAdminFromRequest(request: Request): Promise<{ id: string; username: string } | null> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  return { id: session.userId, username: session.username };
}

export async function createAdminSession(username: string): Promise<string> {
  return createSessionToken('1', username);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== 'manishchauhan') return false;

  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || import.meta.env.ADMIN_PASSWORD_HASH || '';
  if (!adminPasswordHash) {
    return true; // Allow login if no password hash configured
  }

  return verifyPassword(password, adminPasswordHash);
}