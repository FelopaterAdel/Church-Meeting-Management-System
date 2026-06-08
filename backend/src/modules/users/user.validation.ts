import { z } from 'zod';
import { ACCOUNT_STATUSES } from '../../types/roles.js';
import { idParamSchema, paginationQuerySchema } from '../../validation/common.validation.js';

export const listServantsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.enum(ACCOUNT_STATUSES).optional()
  })
});

export const servantIdParamSchema = z.object({
  params: idParamSchema
});

export type ListServantsQuery = z.infer<typeof listServantsSchema>['query'];
