import apiClient from './client';
import type { ApiEnvelope, ApiPaginationMeta } from '../types/api';
import type { Member, MembersListParams, MembersListResponse } from '../types/member';

export const membersApi = {
  getAll: async (params: MembersListParams): Promise<MembersListResponse> => {
    const { data } = await apiClient.get<ApiEnvelope<{ users: Member[] }, ApiPaginationMeta>>('/users', {
      params,
    });

    return {
      members: data.data.users,
      pagination: data.meta!.pagination,
    };
  },

  approve: async (id: string): Promise<Member> => {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: Member }>>(`/users/${id}/approve`);
    return data.data.user;
  },

  reject: async (id: string): Promise<Member> => {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: Member }>>(`/users/${id}/reject`);
    return data.data.user;
  },

  suspend: async (id: string): Promise<Member> => {
    const { data } = await apiClient.patch<ApiEnvelope<{ user: Member }>>(`/users/${id}/suspend`);
    return data.data.user;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
