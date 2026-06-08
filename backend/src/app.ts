import compression from 'compression';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { env, isProduction } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { loggingMiddleware } from './middleware/logging.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { stageRoutes } from './modules/stages/stage.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { sendSuccess } from './utils/response.util.js';

export const createApp = (): Application => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', isProduction ? 1 : false);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: 'draft-7',
      legacyHeaders: false
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(loggingMiddleware);

  app.get('/health', (_req: Request, res: Response) => {
    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Service is healthy',
      data: {
        service: 'church-meeting-management-backend',
        environment: env.NODE_ENV,
        uptime: process.uptime()
      }
    });
  });

  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/stages`, stageRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);

  app.use(env.API_PREFIX, (_req: Request, res: Response) => {
    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Church Meeting Management API',
      data: {
        version: '1.0.0'
      }
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
