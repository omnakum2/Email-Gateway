import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/http';
import { safeEqual, allowedOrigins, isOriginAllowed } from '../utils/security';

// Guards the public browser route: enforces the origin allowlist server-side
// (trailing-slash tolerant), then checks the public key.
export function publicKeyGuard(req: Request, res: Response, next: NextFunction): void {
  const origin = req.header('Origin') || '';
  if (allowedOrigins().length > 0 && !isOriginAllowed(origin)) {
    fail(res, 403, 'Origin not allowed');
    return;
  }

  const configured = process.env.PUBLIC_KEY || '';
  if (!configured) {
    fail(res, 500, 'PUBLIC_KEY is not configured on the server');
    return;
  }
  const provided = req.header('x-public-key') || '';
  if (!safeEqual(provided, configured)) {
    fail(res, 401, 'Invalid or missing public key');
    return;
  }
  next();
}
