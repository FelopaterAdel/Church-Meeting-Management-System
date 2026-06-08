import { z } from 'zod';
import { idParamSchema, objectIdSchema, paginationQuerySchema } from '../../validation/common.validation.js';
import { MEETING_STATUSES } from './meeting.model.js';

export const listMeetingsSchema = z.object({
  query: paginationQuerySchema.extend({
    stageId: objectIdSchema.optional(),
    status: z.enum(MEETING_STATUSES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional()
  })
});

export const createMeetingSchema = z.object({
  body: z.object({
    meetingName: z.string().trim().min(2).max(160),
    date: z.coerce.date(),
    stageId: objectIdSchema
  })
});

export const updateMeetingSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      meetingName: z.string().trim().min(2).max(160).optional(),
      date: z.coerce.date().optional(),
      stageId: objectIdSchema.optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required'
    })
});

export const meetingIdParamSchema = z.object({
  params: idParamSchema
});

export type ListMeetingsQuery = z.infer<typeof listMeetingsSchema>['query'];
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>['body'];
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>['body'];
