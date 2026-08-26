import 'dotenv/config'; // must load env before anything reads process.env
import { buildApp } from './app';
import { verifyConnection } from './mailer/mailer';

const REQUIRED_ENV = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'API_KEY'];

// Fail fast if any required env var is missing.
function validateEnv(): void {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

async function bootstrap(): Promise<void> {
  validateEnv();

  // Fail fast if credentials/connection are bad.
  try {
    await verifyConnection();
    console.log('connection verified');
  } catch (err: any) {
    console.error(`verification failed: ${err?.message || err}`);
    process.exit(1);
  }

  const app = buildApp();
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port);

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error(`Server error: ${err.message}`);
    }
    process.exit(1);
  });

  // Graceful shutdown.
  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap();
