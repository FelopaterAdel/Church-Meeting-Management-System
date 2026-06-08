import { StatusCodes } from 'http-status-codes';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../../utils/app-error.util.js';
import type { AccountStatus } from '../../types/roles.js';
import { UserModel, type User, type UserDocument } from './user.model.js';
import type { ListServantsQuery } from './user.validation.js';

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  role: User['role'];
  status: User['status'];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedServants = {
  servants: PublicUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const toPublicUser = (user: UserDocument): PublicUser => {
  const publicUser: PublicUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  if (user.lastLoginAt) {
    publicUser.lastLoginAt = user.lastLoginAt;
  }

  return publicUser;
};

const buildServantFilter = (query: ListServantsQuery): FilterQuery<User> => {
  const filter: FilterQuery<User> = {
    role: 'SERVANT'
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

export const listServants = async (query: ListServantsQuery): Promise<PaginatedServants> => {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;
  const filter = buildServantFilter(query);

  const [servants, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    servants: servants.map(toPublicUser),
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

export const getServantById = async (servantId: string): Promise<PublicUser> => {
  const servant = await UserModel.findOne({ _id: servantId, role: 'SERVANT' });

  if (!servant) {
    throw new AppError('Servant was not found', StatusCodes.NOT_FOUND);
  }

  return toPublicUser(servant);
};

const updateServantStatus = async (servantId: string, status: AccountStatus): Promise<PublicUser> => {
  const servant = await UserModel.findOne({ _id: servantId, role: 'SERVANT' });

  if (!servant) {
    throw new AppError('Servant was not found', StatusCodes.NOT_FOUND);
  }

  servant.status = status;
  servant.isActive = status !== 'SUSPENDED' && status !== 'REJECTED';
  await servant.save();

  return toPublicUser(servant);
};

export const approveServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'APPROVED');
};

export const rejectServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'REJECTED');
};

export const suspendServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'SUSPENDED');
};

export const reactivateServant = async (servantId: string): Promise<PublicUser> => {
  return updateServantStatus(servantId, 'APPROVED');
};
