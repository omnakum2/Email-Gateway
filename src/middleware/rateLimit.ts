import rateLimit from 'express-rate-limit';
import { fail } from '../utils/http';

// Per-IP limiter for the secret server-to-server route (defaults: 20 / 60s).
export const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => fail(res, 429, 'Too many requests, please try again later'),
});

// Stricter per-IP limiter for the public browser route (defaults: 3 / 60s).
export const publicRateLimiter = rateLimit({
  windowMs: Number(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS) || 60_000,
  limit: Number(process.env.PUBLIC_RATE_LIMIT_MAX) || 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => fail(res, 429, 'Too many requests, please try again later'),
});
