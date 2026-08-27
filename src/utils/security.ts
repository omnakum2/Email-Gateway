import { timingSafeEqual } from 'crypto';

// Constant-time string comparison (length mismatch short-circuits to false).
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Drop surrounding whitespace and any trailing slash(es) so that a configured
// "https://site.com/" and a browser-sent "https://site.com" compare equal.
function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

// Parse ALLOWED_ORIGINS into a clean, slash-normalized list.
export function allowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
}

// Whether an incoming Origin header is allowed (trailing-slash tolerant).
export function isOriginAllowed(origin?: string): boolean {
  if (!origin) return false;
  return allowedOrigins().includes(normalizeOrigin(origin));
}
