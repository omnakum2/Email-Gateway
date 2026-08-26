import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { fail } from '../utils/http';

// Final error handler: multer upload errors (too many files / too large) → 400,
// everything else → 500. Must be registered last.
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof multer.MulterError) {
    fail(res, 400, err.message);
    return;
  }
  fail(res, 500, err?.message || 'Unexpected error');
}
