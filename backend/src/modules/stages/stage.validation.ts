import { z } from 'zod';
import { idParamSchema } from '../../validation/common.validation.js';
import { STAGE_NAMES } from './stage.model.js';

const stageNameSchema = z.enum(STAGE_NAMES);

export const listStagesSchema = z.object({
  query: z.object({
    isActive: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional()
  })
});

export const createStageSchema = z.object({
  body: z.object({
    name: stageNameSchema,
    description: z.string().trim().max(500).optional(),
    sortOrder: z.coerce.number().int().positive().default(1),
    isActive: z.boolean().default(true)
  })
});

export const updateStageSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      name: stageNameSchema.optional(),
      description: z.string().trim().max(500).optional(),
      sortOrder: z.coerce.number().int().positive().optional(),
      isActive: z.boolean().optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required'
    })
});

export const stageIdParamSchema = z.object({
  params: idParamSchema
});

export type ListStagesQuery = z.infer<typeof listStagesSchema>['query'];
export type CreateStageInput = z.infer<typeof createStageSchema>['body'];
export type UpdateStageInput = z.infer<typeof updateStageSchema>['body'];
