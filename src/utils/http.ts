import { Response } from 'express';

// Standard error response shape used everywhere.
export function fail(res: Response, status: number, error: string): void {
  res.status(status).json({ success: false, error });
}

// Standard success response shape used everywhere.
export function ok(res: Response, data: Record<string, unknown> = {}): void {
  res.json({ success: true, ...data });
}
