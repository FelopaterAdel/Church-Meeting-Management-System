import { z } from 'zod';
import { idParamSchema, objectIdSchema, paginationQuerySchema } from '../../validation/common.validation.js';
import { STUDENT_STATUSES } from './student.model.js';


const internalStudentCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Internal student code can only contain letters, numbers, underscores, and hyphens')
  .transform((value) => value.toUpperCase());

export const listStudentsSchema = z.object({
  query: paginationQuerySchema.extend({
    stageId: objectIdSchema.optional(),
    status: z.enum(STUDENT_STATUSES).optional()
  })
});

export const createStudentSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(120),
    stageId: objectIdSchema,
    internalStudentCode: internalStudentCodeSchema,
    status: z.enum(STUDENT_STATUSES).default('ACTIVE')
  })
});

export const updateStudentSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      fullName: z.string().trim().min(2).max(120).optional(),
      stageId: objectIdSchema.optional(),
      internalStudentCode: internalStudentCodeSchema.optional(),
      status: z.enum(STUDENT_STATUSES).optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required'
    })
});

export const studentIdParamSchema = z.object({
  params: idParamSchema
});

export const studentQrCodeParamSchema = z.object({
  params: z.object({
    qrCode: z.string().trim().min(1).max(250)
  })
});

export type ListStudentsQuery = z.infer<typeof listStudentsSchema>['query'];
export type CreateStudentInput = z.infer<typeof createStudentSchema>['body'];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>['body'];
