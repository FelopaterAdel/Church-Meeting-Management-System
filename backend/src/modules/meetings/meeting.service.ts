import { StatusCodes } from 'http-status-codes';
import { Types, type FilterQuery } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import { AttendanceModel } from '../attendance/attendance.model.js';
import { StageModel } from '../stages/stage.model.js';
import { StudentModel } from '../students/student.model.js';
import { MeetingModel, type Meeting, type MeetingDocument } from './meeting.model.js';
import type { CreateMeetingInput, ListMeetingsQuery, UpdateMeetingInput } from './meeting.validation.js';

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicMeeting = {
  id: string;
  meetingName: string;
  date: Date;
  stageId: string;
  status: Meeting['status'];
  createdBy: string;
  closedBy?: string;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type AbsenceGenerationSummary = {
  eligibleStudents: number;
  absenceRecordsCreated: number;
};

export type CloseMeetingResult = {
  meeting: PublicMeeting;
  absenceSummary: AbsenceGenerationSummary;
};

type PaginatedMeetings = {
  meetings: PublicMeeting[];
  pagination: PaginationMeta;
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const toPublicMeeting = (meeting: MeetingDocument): PublicMeeting => {
  const publicMeeting: PublicMeeting = {
    id: meeting.id,
    meetingName: meeting.meetingName,
    date: meeting.date,
    stageId: meeting.stage.toString(),
    status: meeting.status,
    createdBy: meeting.createdBy.toString(),
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt
  };

  if (meeting.closedBy) {
    publicMeeting.closedBy = meeting.closedBy.toString();
  }

  if (meeting.closedAt) {
    publicMeeting.closedAt = meeting.closedAt;
  }

  return publicMeeting;
};

const assertStageExists = async (stageId: string): Promise<void> => {
  const stageExists = await StageModel.exists({ _id: stageId, isActive: true });

  if (!stageExists) {
    throw new AppError('Stage was not found or is inactive', StatusCodes.BAD_REQUEST);
  }
};

const buildMeetingFilter = (query: ListMeetingsQuery): FilterQuery<Meeting> => {
  const filter: FilterQuery<Meeting> = {};

  if (query.stageId) {
    filter.stage = new Types.ObjectId(query.stageId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.fromDate || query.toDate) {
    filter.date = {};

    if (query.fromDate) {
      filter.date.$gte = query.fromDate;
    }

    if (query.toDate) {
      filter.date.$lte = query.toDate;
    }
  }

  if (query.search) {
    filter.meetingName = new RegExp(escapeRegex(query.search), 'i');
  }

  return filter;
};

export const listMeetings = async (query: ListMeetingsQuery): Promise<PaginatedMeetings> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildMeetingFilter(query);

  const [meetings, total] = await Promise.all([
    MeetingModel.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
    MeetingModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meetings: meetings.map(toPublicMeeting),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

export const createMeeting = async (input: CreateMeetingInput, createdBy: string): Promise<PublicMeeting> => {
  await assertStageExists(input.stageId);

  const meeting = await MeetingModel.create({
    meetingName: input.meetingName,
    date: input.date,
    stage: input.stageId,
    status: 'OPEN',
    createdBy
  });

  return toPublicMeeting(meeting);
};

export const getMeetingById = async (meetingId: string): Promise<PublicMeeting> => {
  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicMeeting(meeting);
};

export const updateMeeting = async (meetingId: string, input: UpdateMeetingInput): Promise<PublicMeeting> => {
  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  if (meeting.status === 'CLOSED') {
    throw new AppError('Closed meetings cannot be updated', StatusCodes.FORBIDDEN);
  }

  if (input.stageId) {
    await assertStageExists(input.stageId);
    meeting.stage = new Types.ObjectId(input.stageId);
  }

  if (input.meetingName !== undefined) {
    meeting.meetingName = input.meetingName;
  }

  if (input.date !== undefined) {
    meeting.date = input.date;
  }

  await meeting.save();

  return toPublicMeeting(meeting);
};

const generateAbsencesForMeeting = async (
  meeting: MeetingDocument,
  recordedBy: string
): Promise<AbsenceGenerationSummary> => {
  const eligibleStudents = await StudentModel.find({
    stage: meeting.stage,
    status: 'ACTIVE',
    isDeleted: false
  }).select('_id');

  if (eligibleStudents.length === 0) {
    return {
      eligibleStudents: 0,
      absenceRecordsCreated: 0
    };
  }

  const now = new Date();
  const recordedById = new Types.ObjectId(recordedBy);
  const result = await AttendanceModel.bulkWrite(
    eligibleStudents.map((student) => ({
      updateOne: {
        filter: {
          meeting: meeting._id,
          student: student._id
        },
        update: {
          $setOnInsert: {
            meeting: meeting._id,
            student: student._id,
            status: 'ABSENT',
            method: 'SYSTEM',
            attendedAt: now,
            recordedBy: recordedById,
            createdAt: now,
          }
        },
        upsert: true
      }
    })),
    {
      ordered: false
    }
  );

  return {
    eligibleStudents: eligibleStudents.length,
    absenceRecordsCreated: result.upsertedCount
  };
};

export const closeMeeting = async (meetingId: string, closedBy: string): Promise<CloseMeetingResult> => {
  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  if (meeting.status === 'CLOSED') {
    throw new AppError('Meeting is already closed', StatusCodes.CONFLICT);
  }

  const absenceSummary = await generateAbsencesForMeeting(meeting, closedBy);

  meeting.status = 'CLOSED';
  meeting.closedBy = new Types.ObjectId(closedBy);
  meeting.closedAt = new Date();
  await meeting.save();

  return {
    meeting: toPublicMeeting(meeting),
    absenceSummary
  };
};

export const reopenMeeting = async (meetingId: string): Promise<PublicMeeting> => {
  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  if (meeting.status === 'OPEN') {
    throw new AppError('Meeting is already open', StatusCodes.CONFLICT);
  }

  meeting.status = 'OPEN';
  meeting.set('closedBy', undefined);
  meeting.set('closedAt', undefined);
  await meeting.save();

  return toPublicMeeting(meeting);
};

export const assertMeetingCanAcceptAttendance = async (meetingId: string): Promise<MeetingDocument> => {
  const meeting = await MeetingModel.findById(meetingId);

  if (!meeting) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  if (meeting.status === 'CLOSED') {
    throw new AppError('Closed meetings cannot accept attendance', StatusCodes.FORBIDDEN);
  }

  return meeting;
};
