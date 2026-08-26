import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/http';

const OFF_VALUES = ['false', '0', 'off', 'no'];

// Per-route kill-switch. If the given env flag is turned off, the route responds
// as if it doesn't exist (404) — useful to instantly cut a route during a spam
// incident. Default is ON when the flag is unset. Env changes apply on restart.
export function requireEnabled(flag: string) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const raw = (process.env[flag] ?? 'true').trim().toLowerCase();
    if (OFF_VALUES.includes(raw)) {
      fail(res, 404, 'Not found');
      return;
    }
    next();
  };
}
