import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/http';
import { safeEqual } from '../utils/security';

// Rejects any request without a matching x-api-key header (secret, server-to-server).
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
