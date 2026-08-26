import express from 'express';
import { apiKeyGuard } from './middleware/apiKey';
import { rateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { emailRouter } from './routes/emailRoute';
import { ok } from './utils/http';

// Assemble the Express app (no listen here → unit-testable).
export function buildApp() {
  const app = express();

  app.use(express.json());

  // Public health check (before auth + rate limiting).
  app.get('/health', (_req, res) => {
    ok(res, { status: 'ok' });
  });

  // Rate-limit first so auth attempts are throttled too, then require the API key.
  app.use(rateLimiter);
  app.use(apiKeyGuard);

  // Protected routes.
  app.use(emailRouter);

  // Error handler must be registered last.
  app.use(errorHandler);

  return app;
}
