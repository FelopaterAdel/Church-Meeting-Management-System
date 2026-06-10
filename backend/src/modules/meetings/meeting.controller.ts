import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.util.js';
import * as meetingService from './meeting.service.js';
import type { CreateMeetingInput, ListMeetingsQuery, UpdateMeetingInput } from './meeting.validation.js';

type MeetingIdParams = {
  id: string;
};

const getMeetingId = (req: Request): string => {
  return (req.params as MeetingIdParams).id;
};

export const listMeetings = async (req: Request, res: Response): Promise<void> => {
  const result = await meetingService.listMeetings(req.query as unknown as ListMeetingsQuery);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meetings retrieved successfully',
    data: {
      meetings: result.meetings
    },
    meta: {
      pagination: result.pagination
    }
  });
};

export const createMeeting = async (req: Request, res: Response): Promise<void> => {
  const meeting = await meetingService.createMeeting(req.body as CreateMeetingInput, req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Meeting created successfully',
    data: { meeting }
  });
};

export const getMeetingById = async (req: Request, res: Response): Promise<void> => {
  const meeting = await meetingService.getMeetingById(getMeetingId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meeting retrieved successfully',
    data: { meeting }
  });
};

export const updateMeeting = async (req: Request, res: Response): Promise<void> => {
  const meeting = await meetingService.updateMeeting(getMeetingId(req), req.body as UpdateMeetingInput);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meeting updated successfully',
    data: { meeting }
  });
};

export const closeMeeting = async (req: Request, res: Response): Promise<void> => {
  const result = await meetingService.closeMeeting(getMeetingId(req), req.user!.id);

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meeting closed successfully',
    data: {
      meeting: result.meeting,
      absenceSummary: result.absenceSummary
    }
  });
};

export const reopenMeeting = async (req: Request, res: Response): Promise<void> => {
  const meeting = await meetingService.reopenMeeting(getMeetingId(req));

  sendSuccess(res, {
    statusCode: StatusCodes.OK,
    message: 'Meeting reopened successfully',
    data: { meeting }
  });
};
