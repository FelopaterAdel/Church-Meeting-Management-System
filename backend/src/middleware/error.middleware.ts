import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.util.js';
import { logger } from '../utils/logger.util.js';
import { sendError } from '../utils/response.util.js';
import { isProduction } from '../config/env.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    sendError(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Validation failed',
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.details
    });
    return;
  }

  logger.error('Unhandled application error', error);

  sendError(res, {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: isProduction ? 'Internal server error' : error.message,
    errors: isProduction ? undefined : error
  });
};
