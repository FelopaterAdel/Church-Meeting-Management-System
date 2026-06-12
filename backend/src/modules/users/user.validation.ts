import { z } from 'zod';
import { ACCOUNT_STATUSES, USER_ROLES } from '../../types/roles.js';
import { idParamSchema, paginationQuerySchema } from '../../validation/common.validation.js';

export const listUsersSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.enum(ACCOUNT_STATUSES).optional(),
    role: z.enum(USER_ROLES).optional()
  })
});

export const listServantsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.enum(ACCOUNT_STATUSES).optional()
  })
});

export const servantIdParamSchema = z.object({
  params: idParamSchema
});

export const userIdParamSchema = z.object({
  params: idParamSchema
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type ListServantsQuery = z.infer<typeof listServantsSchema>['query'];
