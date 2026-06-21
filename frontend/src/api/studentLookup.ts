import apiClient from './client';
import type { ApiEnvelope, ApiPaginationMeta } from '../types/api';

export interface StudentLookupItem {
  id: string;
  fullName: string;
  stageId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const studentLookupApi = {
  search: async (params: {
    page: number;
    limit: number;
    search?: string;
    stageId?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }): Promise<{ students: StudentLookupItem[]; total: number }> => {
    const { data } = await apiClient.get<ApiEnvelope<{ students: StudentLookupItem[] }, ApiPaginationMeta>>('/students', {
      params,
    });
    return {
      students: data.data.students,
      total: data.meta?.pagination.total ?? data.data.students.length,
    };
  },
};
