import apiClient from './client';
import type { ApiEnvelope, ApiPaginationMeta } from '../types/api';
import type { CloseMeetingResult, Meeting, MeetingFormData, MeetingsListParams } from '../types/meeting';

export const meetingsApi = {
  getAll: async (params: MeetingsListParams): Promise<{ meetings: Meeting[]; pagination: ApiPaginationMeta['pagination'] }> => {
    const { data } = await apiClient.get<ApiEnvelope<{ meetings: Meeting[] }, ApiPaginationMeta>>('/meetings', {
      params,
    });
    return {
      meetings: data.data.meetings,
      pagination: data.meta!.pagination,
    };
  },

  getById: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.get<ApiEnvelope<{ meeting: Meeting }>>(`/meetings/${id}`);
    return data.data.meeting;
  },

  create: async (payload: MeetingFormData): Promise<Meeting> => {
    const { data } = await apiClient.post<ApiEnvelope<{ meeting: Meeting }>>('/meetings', payload);
    return data.data.meeting;
  },

  update: async (id: string, payload: Partial<MeetingFormData>): Promise<Meeting> => {
    const { data } = await apiClient.put<ApiEnvelope<{ meeting: Meeting }>>(`/meetings/${id}`, payload);
    return data.data.meeting;
  },

  close: async (id: string): Promise<CloseMeetingResult> => {
    const { data } = await apiClient.patch<ApiEnvelope<CloseMeetingResult>>(`/meetings/${id}/close`);
    return data.data;
  },

  reopen: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.patch<ApiEnvelope<{ meeting: Meeting }>>(`/meetings/${id}/reopen`);
    return data.data.meeting;
  },
};
