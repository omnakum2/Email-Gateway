import { Request, Response, NextFunction } from 'express';
import { isOriginAllowed } from '../utils/security';

// Applied globally (before body parsing) so that EVERY response — success, auth
// error, bad JSON, 404, and preflight — carries CORS headers for allowed origins.
// Answers OPTIONS preflight with 204. Origin matching is trailing-slash tolerant.
export function publicCors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.header('Origin');
  if (origin && isOriginAllowed(origin)) {
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
