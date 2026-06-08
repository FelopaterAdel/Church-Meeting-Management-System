import { z } from 'zod';
import { idParamSchema, objectIdSchema, paginationQuerySchema } from '../../validation/common.validation.js';

const visitDateSchema = z.coerce.date();

export const listStudentVisitsSchema = z.object({
  params: z.object({
    studentId: objectIdSchema
  }),
  query: paginationQuerySchema.omit({ search: true })
});

export const createVisitSchema = z.object({
  body: z.object({
    studentId: objectIdSchema,
    servantId: objectIdSchema.optional(),
    visitDate: visitDateSchema,
    notes: z.string().trim().min(1).max(2000)
  })
});

export const updateVisitSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      servantId: objectIdSchema.optional(),
      visitDate: visitDateSchema.optional(),
      notes: z.string().trim().min(1).max(2000).optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required'
    })
});

export const visitIdParamSchema = z.object({
  params: idParamSchema
});

export type ListStudentVisitsQuery = z.infer<typeof listStudentVisitsSchema>['query'];
export type CreateVisitInput = z.infer<typeof createVisitSchema>['body'];
export type UpdateVisitInput = z.infer<typeof updateVisitSchema>['body'];
