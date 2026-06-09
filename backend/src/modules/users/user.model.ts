import { Schema, model, type HydratedDocument, type Model } from 'mongoose';
import { ACCOUNT_STATUSES, USER_ROLES, type AccountStatus, type UserRole } from '../../types/roles.js';

export type User = {
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDocument = HydratedDocument<User>;

type UserModelType = Model<User>;

const userSchema = new Schema<User, UserModelType>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'SERVANT',
      index: true
    },
    status: {
      type: String,
      enum: ACCOUNT_STATUSES,
      required: true,
      default: 'PENDING',
      index: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ role: 1, status: 1 });

export const UserModel = model<User, UserModelType>('User', userSchema);
