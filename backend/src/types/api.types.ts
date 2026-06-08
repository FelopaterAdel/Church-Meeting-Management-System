export type ApiSuccess<TData = unknown> = {
  success: true;
  message: string;
  data?: TData;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};
