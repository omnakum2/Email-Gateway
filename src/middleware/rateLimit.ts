import rateLimit from 'express-rate-limit';
import { fail } from '../utils/http';

// Per-IP limiter, tuned via env (defaults: 20 requests / 60s).
export const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => fail(res, 429, 'Too many requests, please try again later'),
});
