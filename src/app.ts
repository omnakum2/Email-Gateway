import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { emailRouter } from './routes/emailRoute';
import { publicEmailRouter } from './routes/publicEmailRoute';
import { ok } from './utils/http';

// Assemble the Express app (no listen here → unit-testable).
// Each route carries its own guards, so the two tiers stay independent:
//   /send         → secret API key (server-to-server)
//   /public-send  → public key + origin allowlist + strict rate limit (browser)
export function buildApp() {
  const app = express();

  app.use(express.json());

  // Public, unauthenticated health probe.
  app.get('/health', (_req, res) => {
    ok(res, { status: 'ok' });
  });

  app.use(emailRouter);
  app.use(publicEmailRouter);

  // Error handler must be registered last.
  app.use(errorHandler);

  return app;
}
