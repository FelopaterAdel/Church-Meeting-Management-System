import { isDevelopment } from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error' | 'http' | 'debug';

const formatPayload = (payload: unknown): unknown => {
  if (payload instanceof Error) {
    return {
      name: payload.name,
      message: payload.message,
      stack: isDevelopment ? payload.stack : undefined
    };
  }

  return payload;
};

const log = (level: LogLevel, message: string, payload?: unknown): void => {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(payload === undefined ? {} : { payload: formatPayload(payload) })
  };

  const line = JSON.stringify(entry);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
};

export const logger = {
  info: (message: string, payload?: unknown): void => log('info', message, payload),
  warn: (message: string, payload?: unknown): void => log('warn', message, payload),
  error: (message: string, payload?: unknown): void => log('error', message, payload),
  http: (message: string, payload?: unknown): void => log('http', message, payload),
  debug: (message: string, payload?: unknown): void => {
    if (isDevelopment) {
      log('debug', message, payload);
    }
  }
};
