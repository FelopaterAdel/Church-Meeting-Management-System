import { StatusCodes } from 'http-status-codes';
import { Types, type FilterQuery } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import { StageModel } from '../stages/stage.model.js';
import { StudentModel, type Student, type StudentDocument } from './student.model.js';
import type { CreateStudentInput, ListStudentsQuery, UpdateStudentInput } from './student.validation.js';

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicStudent = {
  id: string;
  fullName: string;
  phoneNumber: string;
  confessionFather: string;
  address: string;
  latitude?: number;
  longitude?: number;
  stageId: string;
  qrCode?: string;
  internalStudentCode: string;
  status: Student['status'];
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedStudents = {
  students: PublicStudent[];
  pagination: PaginationMeta;
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const toPublicStudent = (student: StudentDocument): PublicStudent => {
  const publicStudent: PublicStudent = {
    id: student.id,
    fullName: student.fullName,
    phoneNumber: student.phoneNumber,
    confessionFather: student.confessionFather,
    address: student.address,
    stageId: student.stage.toString(),
    internalStudentCode: student.internalStudentCode,
    status: student.status,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  };

  if (student.latitude !== undefined) {
    publicStudent.latitude = student.latitude;
  }

  if (student.longitude !== undefined) {
    publicStudent.longitude = student.longitude;
  }

  if (student.qrCode) {
    publicStudent.qrCode = student.qrCode;
  }

  return publicStudent;
};

const assertStageExists = async (stageId: string): Promise<void> => {
  const stageExists = await StageModel.exists({ _id: stageId, isActive: true });

  if (!stageExists) {
    throw new AppError('Stage was not found or is inactive', StatusCodes.BAD_REQUEST);
  }
};

const assertStudentIdentifiersAreAvailable = async (
  input: Pick<CreateStudentInput, 'internalStudentCode' | 'qrCode'>,
  excludeStudentId?: string
): Promise<void> => {
  const orConditions: FilterQuery<Student>[] = [{ internalStudentCode: input.internalStudentCode }];

  if (input.qrCode) {
    orConditions.push({ qrCode: input.qrCode });
  }

  const existingStudent = await StudentModel.findOne({
    $or: orConditions,
    ...(excludeStudentId ? { _id: { $ne: excludeStudentId } } : {})
  });

  if (!existingStudent) {
    return;
  }

  if (existingStudent.internalStudentCode === input.internalStudentCode) {
    throw new AppError('Internal student code already exists', StatusCodes.CONFLICT);
  }

  throw new AppError('QR code already exists', StatusCodes.CONFLICT);
};

const buildStudentFilter = (query: ListStudentsQuery): FilterQuery<Student> => {
  const filter: FilterQuery<Student> = {
    isDeleted: false
  };

  if (query.stageId) {
    filter.stage = new Types.ObjectId(query.stageId);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [
      { fullName: searchRegex },
      { phoneNumber: searchRegex },
      { confessionFather: searchRegex },
      { address: searchRegex },
      { internalStudentCode: searchRegex },
      { qrCode: searchRegex }
    ];
  }

  return filter;
};

export const listStudents = async (query: ListStudentsQuery): Promise<PaginatedStudents> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildStudentFilter(query);

  const [students, total] = await Promise.all([
    StudentModel.find(filter).sort({ fullName: 1, createdAt: -1 }).skip(skip).limit(limit),
    StudentModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    students: students.map(toPublicStudent),
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

export const getStudentById = async (studentId: string): Promise<PublicStudent> => {
  const student = await StudentModel.findOne({ _id: studentId, isDeleted: false });

  if (!student) {
    throw new AppError('Student was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicStudent(student);
};

export const createStudent = async (input: CreateStudentInput): Promise<PublicStudent> => {
  await assertStageExists(input.stageId);
  await assertStudentIdentifiersAreAvailable(input);

  const student = await StudentModel.create({
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    confessionFather: input.confessionFather,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    stage: input.stageId,
    qrCode: input.qrCode ?? `STUDENT:${input.internalStudentCode}`,
    internalStudentCode: input.internalStudentCode,
    status: input.status
  });

  return toPublicStudent(student);
};

export const updateStudent = async (studentId: string, input: UpdateStudentInput): Promise<PublicStudent> => {
  const student = await StudentModel.findOne({ _id: studentId, isDeleted: false });

  if (!student) {
    throw new AppError('Student was not found', StatusCodes.NOT_FOUND);
  }

  const nextInternalStudentCode = input.internalStudentCode ?? student.internalStudentCode;
  const nextQrCode = input.qrCode ?? student.qrCode;

  await assertStudentIdentifiersAreAvailable(
    {
      internalStudentCode: nextInternalStudentCode,
      qrCode: nextQrCode
    },
    studentId
  );

  if (input.stageId) {
    await assertStageExists(input.stageId);
    student.stage = new Types.ObjectId(input.stageId);
  }

  if (input.fullName !== undefined) {
    student.fullName = input.fullName;
  }

  if (input.phoneNumber !== undefined) {
    student.phoneNumber = input.phoneNumber;
  }

  if (input.confessionFather !== undefined) {
    student.confessionFather = input.confessionFather;
  }

  if (input.address !== undefined) {
    student.address = input.address;
  }

  if (input.latitude !== undefined) {
    student.latitude = input.latitude;
  }

  if (input.longitude !== undefined) {
    student.longitude = input.longitude;
  }

  if (input.qrCode !== undefined) {
    student.qrCode = input.qrCode;
  }

  if (input.internalStudentCode !== undefined) {
    student.internalStudentCode = input.internalStudentCode;
  }

  if (input.status !== undefined) {
    student.status = input.status;
  }

  await student.save();

  return toPublicStudent(student);
};

export const softDeleteStudent = async (studentId: string): Promise<void> => {
  const student = await StudentModel.findOne({ _id: studentId, isDeleted: false });

  if (!student) {
    throw new AppError('Student was not found', StatusCodes.NOT_FOUND);
  }

  student.isDeleted = true;
  student.deletedAt = new Date();
  student.status = 'INACTIVE';
  await student.save();
};
