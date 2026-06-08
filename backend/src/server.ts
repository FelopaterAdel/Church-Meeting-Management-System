import http from 'node:http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.util.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info(`${signal} received. Starting graceful shutdown`);

    server.close((error) => {
      void (async (): Promise<void> => {
      if (error) {
        logger.error('HTTP server shutdown failed', error);
        process.exit(1);
      }

      await disconnectDatabase();
      logger.info('Graceful shutdown completed');
      process.exit(0);
      })();
    });
  };

  process.on('SIGTERM', (signal) => {
    void shutdown(signal);
  });
  process.on('SIGINT', (signal) => {
    void shutdown(signal);
  });
};

startServer().catch((error) => {
  logger.error('Application startup failed', error);
  process.exit(1);
});
