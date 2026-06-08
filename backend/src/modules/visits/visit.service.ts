import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import type { UserRole } from '../../types/roles.js';
import { StudentModel } from '../students/student.model.js';
import { UserModel } from '../users/user.model.js';
import { VisitModel, type VisitDocument } from './visit.model.js';
import type { CreateVisitInput, ListStudentVisitsQuery, UpdateVisitInput } from './visit.validation.js';

type Actor = {
  id: string;
  role: UserRole;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicVisit = {
  id: string;
  studentId: string;
  servantId: string;
  visitDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedVisits = {
  visits: PublicVisit[];
  pagination: PaginationMeta;
};

const toPublicVisit = (visit: VisitDocument): PublicVisit => ({
  id: visit.id,
  studentId: visit.student.toString(),
  servantId: visit.servant.toString(),
  visitDate: visit.visitDate,
  notes: visit.notes,
  createdAt: visit.createdAt,
  updatedAt: visit.updatedAt
});

const assertStudentExists = async (studentId: string): Promise<void> => {
  const studentExists = await StudentModel.exists({ _id: studentId, isDeleted: false });

  if (!studentExists) {
    throw new AppError('Student was not found', StatusCodes.NOT_FOUND);
  }
};

const assertServantExists = async (servantId: string): Promise<void> => {
  const servantExists = await UserModel.exists({
    _id: servantId,
    role: 'SERVANT',
    status: 'APPROVED',
    isActive: true
  });

  if (!servantExists) {
    throw new AppError('Servant was not found or is not approved', StatusCodes.BAD_REQUEST);
  }
};

const resolveServantId = async (actor: Actor, requestedServantId?: string): Promise<string> => {
  if (actor.role === 'SERVANT') {
    if (requestedServantId && requestedServantId !== actor.id) {
      throw new AppError('Servants can only create visits for themselves', StatusCodes.FORBIDDEN);
    }

    return actor.id;
  }

  if (!requestedServantId) {
    throw new AppError('servantId is required for Super Admin visit records', StatusCodes.BAD_REQUEST);
  }

  await assertServantExists(requestedServantId);
  return requestedServantId;
};

export const createVisit = async (input: CreateVisitInput, actor: Actor): Promise<PublicVisit> => {
  await assertStudentExists(input.studentId);

  const servantId = await resolveServantId(actor, input.servantId);

  if (actor.role === 'SERVANT') {
    await assertServantExists(servantId);
  }

  const visit = await VisitModel.create({
    student: input.studentId,
    servant: servantId,
    visitDate: input.visitDate,
    notes: input.notes
  });

  return toPublicVisit(visit);
};

export const updateVisit = async (visitId: string, input: UpdateVisitInput, actor: Actor): Promise<PublicVisit> => {
  const visit = await VisitModel.findOne({ _id: visitId, isDeleted: false });

  if (!visit) {
    throw new AppError('Visit was not found', StatusCodes.NOT_FOUND);
  }

  if (actor.role === 'SERVANT' && visit.servant.toString() !== actor.id) {
    throw new AppError('Servants can only edit their own visits', StatusCodes.FORBIDDEN);
  }

  if (input.servantId) {
    if (actor.role !== 'SUPER_ADMIN') {
      throw new AppError('Only Super Admin can reassign visit servants', StatusCodes.FORBIDDEN);
    }

    await assertServantExists(input.servantId);
    visit.servant = new Types.ObjectId(input.servantId);
  }

  if (input.visitDate !== undefined) {
    visit.visitDate = input.visitDate;
  }

  if (input.notes !== undefined) {
    visit.notes = input.notes;
  }

  await visit.save();

  return toPublicVisit(visit);
};

export const softDeleteVisit = async (visitId: string, actor: Actor): Promise<void> => {
  const visit = await VisitModel.findOne({ _id: visitId, isDeleted: false });

  if (!visit) {
    throw new AppError('Visit was not found', StatusCodes.NOT_FOUND);
  }

  if (actor.role === 'SERVANT' && visit.servant.toString() !== actor.id) {
    throw new AppError('Servants can only delete their own visits', StatusCodes.FORBIDDEN);
  }

  visit.isDeleted = true;
  visit.deletedAt = new Date();
  await visit.save();
};

export const listStudentVisits = async (
  studentId: string,
  query: ListStudentVisitsQuery
): Promise<PaginatedVisits> => {
  await assertStudentExists(studentId);

  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = {
    student: new Types.ObjectId(studentId),
    isDeleted: false
  };

  const [visits, total] = await Promise.all([
    VisitModel.find(filter).sort({ visitDate: -1, createdAt: -1 }).skip(skip).limit(limit),
    VisitModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    visits: visits.map(toPublicVisit),
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
