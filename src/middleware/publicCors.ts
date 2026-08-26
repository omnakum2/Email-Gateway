import { Request, Response, NextFunction } from 'express';
import { allowedOrigins } from '../utils/security';

// Sets CORS headers for allowed origins and answers preflight requests, so that
// approved browser origins can call the public route. This only enables the
// browser — the actual server-side origin enforcement lives in publicKeyGuard.
export function publicCors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.header('Origin');
  if (origin && allowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-public-key');
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
}
