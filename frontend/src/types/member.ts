import type { PaginationMeta } from './api';
import type { User } from './index';

export type UserStatus = User['status'];
export type UserRole = User['role'];

export interface Member extends User {
  phone?: string;
}

export interface MembersListParams {
  page: number;
  limit: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface MembersListResponse {
  members: Member[];
  pagination: PaginationMeta;
}

export type MemberStatusAction = 'approve' | 'reject' | 'suspend';
