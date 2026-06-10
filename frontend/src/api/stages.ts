import apiClient from './client';
import type { ApiEnvelope } from '../types/api';
import type { Stage } from '../types/stage';

export const stagesApi = {
  getAll: async (): Promise<Stage[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ stages: Stage[] }>>('/stages', {
      params: { isActive: true },
    });
    return data.data.stages;
  },
};
