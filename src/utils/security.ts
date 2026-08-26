import { timingSafeEqual } from 'crypto';

// Constant-time string comparison (length mismatch short-circuits to false).
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Parse ALLOWED_ORIGINS ("https://a.com,https://b.com") into a clean list.
export function allowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}
