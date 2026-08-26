import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';
import { fail } from '../utils/http';

// Constant-time string comparison (length mismatch short-circuits to false).
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Rejects any request without a matching x-api-key header.
export function apiKeyGuard(req: Request, res: Response, next: NextFunction): void {
  const configured = process.env.API_KEY || '';
  if (!configured) {
    fail(res, 500, 'API_KEY is not configured on the server');
    return;
  }
  const provided = req.header('x-api-key') || '';
  if (!safeEqual(provided, configured)) {
    fail(res, 401, 'Invalid or missing x-api-key');
    return;
  }
  next();
}
