import { StatusCodes } from 'http-status-codes';
import { UserModel, type User, type UserDocument } from '../users/user.model.js';
import { AppError } from '../../utils/app-error.util.js';
import { hashPassword, verifyPassword } from '../../utils/password.util.js';
import { signAccessToken } from '../../utils/token.util.js';
import type { LoginInput, RegisterServantInput } from './auth.validation.js';

type PublicUser = {
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

type AuthResult = {
  user: PublicUser;
  accessToken: string;
};

const toPublicUser = (user: UserDocument): PublicUser => {
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

const assertCanLogin = (user: UserDocument): void => {
  if (!user.isActive) {
    throw new AppError('Account is inactive', StatusCodes.FORBIDDEN);
  }

  if (user.status !== 'APPROVED') {
    throw new AppError(`Account is ${user.status.toLowerCase()}`, StatusCodes.FORBIDDEN);
  }
};

export const registerServant = async (input: RegisterServantInput): Promise<PublicUser> => {
  const existingUser = await UserModel.exists({ email: input.email });

  if (existingUser) {
    throw new AppError('Email is already registered', StatusCodes.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    role: 'SERVANT',
    status: 'PENDING'
  });

  return toPublicUser(user);
};

export const login = async (input: LoginInput): Promise<AuthResult> => {
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  assertCanLogin(user);

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role
  });

  return {
    user: toPublicUser(user),
    accessToken
  };
};

export const getAuthenticatedUser = async (userId: string): Promise<PublicUser> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError('Authenticated user was not found', StatusCodes.UNAUTHORIZED);
  }

  assertCanLogin(user);

  return toPublicUser(user);
};
