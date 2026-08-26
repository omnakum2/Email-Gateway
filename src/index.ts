import 'dotenv/config'; // load env before anything reads process.env
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first'); // prefer IPv4 so Gmail SMTP connects reliably on serverless

import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { emailRouter } from './routes/emailRoute';
import { publicEmailRouter } from './routes/publicEmailRoute';
import { ok } from './utils/http';

// Assemble the Express app. Each route carries its own guards:
//   /send-email         → secret API key (server-to-server)
//   /send-public-email  → public key + origin allowlist (browser contact form)
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

const app = buildApp();

// Vercel imports this default export and runs the app as a serverless function.
export default app;

// Local dev only — Vercel sets process.env.VERCEL and provides its own server.
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Email gateway listening on http://localhost:${port}`);
  });
}
