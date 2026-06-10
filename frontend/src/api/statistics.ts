import apiClient from './client';
import type { ApiEnvelope } from '../types/api';
import type { DashboardStatistics, StatisticsFilters, StudentRankingItem } from '../types/statistics';

export const statisticsApi = {
  getDashboard: async (params: StatisticsFilters = {}): Promise<DashboardStatistics> => {
    const { data } = await apiClient.get<ApiEnvelope<{ statistics: DashboardStatistics }>>('/statistics/dashboard', {
      params,
    });
    return data.data.statistics;
  },

  getMostActiveStudents: async (params: StatisticsFilters = {}): Promise<StudentRankingItem[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ students: StudentRankingItem[] }>>(
      '/statistics/reports/most-active-students',
      { params }
    );
    return data.data.students;
  },

  getMostAbsentStudents: async (params: StatisticsFilters = {}): Promise<StudentRankingItem[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ students: StudentRankingItem[] }>>(
      '/statistics/reports/most-absent-students',
      { params }
    );
    return data.data.students;
  },
};
