export interface ApiEnvelope<TData, TMeta = unknown> {
  success: boolean;
  message: string;
  data: TData;
  meta?: TMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiPaginationMeta {
  pagination: PaginationMeta;
}
