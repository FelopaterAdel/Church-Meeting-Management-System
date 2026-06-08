import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type SuccessResponse<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
};

type ErrorResponse = {
  statusCode?: number;
  message: string;
  errors?: unknown;
};

export const sendSuccess = <T>(
  res: Response,
  { statusCode = StatusCodes.OK, message = 'Success', data, meta }: SuccessResponse<T>
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};

export const sendError = (
  res: Response,
  { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message, errors }: ErrorResponse
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
