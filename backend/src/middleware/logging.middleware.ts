import morgan from 'morgan';
import { isProduction, isTest } from '../config/env.js';
import { logger } from '../utils/logger.util.js';

const stream = {
  write: (message: string): void => {
    logger.http(message.trim());
  }
};

export const loggingMiddleware = morgan(isProduction ? 'combined' : 'dev', {
  stream,
  skip: () => isTest
});
