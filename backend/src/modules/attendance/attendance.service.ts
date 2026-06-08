import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import { assertMeetingCanAcceptAttendance } from '../meetings/meeting.service.js';
import { MeetingModel } from '../meetings/meeting.model.js';
import { StudentModel, type StudentDocument } from '../students/student.model.js';
import {
  AttendanceModel,
  type AttendanceDocument,
  type AttendanceMethod,
  type AttendanceStatus
} from './attendance.model.js';
import type { ListAttendanceQuery, ManualAttendanceInput, QrAttendanceInput } from './attendance.validation.js';

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicAttendance = {
  id: string;
  meetingId: string;
  studentId: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  attendedAt: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedAttendance = {
  attendance: PublicAttendance[];
  pagination: PaginationMeta;
};

const toPublicAttendance = (attendance: AttendanceDocument): PublicAttendance => ({
  id: attendance.id,
  meetingId: attendance.meeting.toString(),
  studentId: attendance.student.toString(),
  status: attendance.status,
  method: attendance.method,
  attendedAt: attendance.attendedAt,
  recordedBy: attendance.recordedBy.toString(),
  createdAt: attendance.createdAt,
  updatedAt: attendance.updatedAt
});

const isDuplicateKeyError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
};

const getActiveStudentById = async (studentId: string): Promise<StudentDocument> => {
  const student = await StudentModel.findOne({
    _id: studentId,
    status: 'ACTIVE',
    isDeleted: false
  });

  if (!student) {
    throw new AppError('Active student was not found', StatusCodes.NOT_FOUND);
  }

  return student;
};

const getActiveStudentByQrCode = async (qrCode: string): Promise<StudentDocument> => {
  const student = await StudentModel.findOne({
    qrCode,
    status: 'ACTIVE',
    isDeleted: false
  });

  if (!student) {
    throw new AppError('Active student QR code was not found', StatusCodes.NOT_FOUND);
  }

  return student;
};

const createAttendance = async (
  meetingId: string,
  student: StudentDocument,
  method: AttendanceMethod,
  recordedBy: string
): Promise<PublicAttendance> => {
  const meeting = await assertMeetingCanAcceptAttendance(meetingId);

  if (student.stage.toString() !== meeting.stage.toString()) {
    throw new AppError('Student does not belong to this meeting stage', StatusCodes.BAD_REQUEST);
  }

  const existingAttendance = await AttendanceModel.exists({
    meeting: meetingId,
    student: student.id
  });

  if (existingAttendance) {
    throw new AppError('Student attendance has already been recorded for this meeting', StatusCodes.CONFLICT);
  }

  let attendance: AttendanceDocument;

  try {
    attendance = await AttendanceModel.create({
      meeting: meetingId,
      student: student.id,
      status: 'PRESENT',
      method,
      attendedAt: new Date(),
      recordedBy
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new AppError('Student attendance has already been recorded for this meeting', StatusCodes.CONFLICT);
    }

    throw error;
  }

  return toPublicAttendance(attendance);
};

export const markAttendanceByQrCode = async (
  input: QrAttendanceInput,
  recordedBy: string
): Promise<PublicAttendance> => {
  const student = await getActiveStudentByQrCode(input.qrCode);

  return createAttendance(input.meetingId, student, 'QR', recordedBy);
};

export const markManualAttendance = async (
  input: ManualAttendanceInput,
  recordedBy: string
): Promise<PublicAttendance> => {
  const student = await getActiveStudentById(input.studentId);

  return createAttendance(input.meetingId, student, 'MANUAL', recordedBy);
};

export const listStudentAttendance = async (
  studentId: string,
  query: ListAttendanceQuery
): Promise<PaginatedAttendance> => {
  await getActiveStudentById(studentId);

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = {
    student: new Types.ObjectId(studentId)
  };

  const [attendance, total] = await Promise.all([
    AttendanceModel.find(filter).sort({ attendedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    AttendanceModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    attendance: attendance.map(toPublicAttendance),
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

export const listMeetingAttendance = async (
  meetingId: string,
  query: ListAttendanceQuery
): Promise<PaginatedAttendance> => {
  const meetingExists = await MeetingModel.exists({ _id: meetingId });

  if (!meetingExists) {
    throw new AppError('Meeting was not found', StatusCodes.NOT_FOUND);
  }

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = {
    meeting: new Types.ObjectId(meetingId)
  };

  const [attendance, total] = await Promise.all([
    AttendanceModel.find(filter).sort({ attendedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    AttendanceModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    attendance: attendance.map(toPublicAttendance),
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
