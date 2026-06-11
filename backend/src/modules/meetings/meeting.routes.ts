import { Router } from 'express';
import { asyncHandler } from '../../middleware/async-handler.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import * as meetingController from './meeting.controller.js';
import {
  createMeetingSchema,
  listMeetingsSchema,
  meetingIdParamSchema,
  updateMeetingSchema
} from './meeting.validation.js';

export const meetingRoutes = Router();

meetingRoutes.use(authenticate);

meetingRoutes.get('/', validateRequest(listMeetingsSchema), asyncHandler(meetingController.listMeetings));
meetingRoutes.get('/:id', validateRequest(meetingIdParamSchema), asyncHandler(meetingController.getMeetingById));
meetingRoutes.post(
  '/',
   authorizeRoles('SUPER_ADMIN'),
   validateRequest(createMeetingSchema),
  asyncHandler(meetingController.createMeeting)
);
meetingRoutes.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(updateMeetingSchema),
  asyncHandler(meetingController.updateMeeting)
);
meetingRoutes.patch(
  '/:id/close',
  authorizeRoles('SUPER_ADMIN'),
 validateRequest(meetingIdParamSchema),
  asyncHandler(meetingController.closeMeeting)
);
meetingRoutes.patch(
  '/:id/reopen',
  authorizeRoles('SUPER_ADMIN'),
  validateRequest(meetingIdParamSchema),
  asyncHandler(meetingController.reopenMeeting)
);
