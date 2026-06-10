import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statistics';
import type { StatisticsFilters } from '../types/statistics';

export const STATISTICS_QUERY_KEY = 'statistics';

export const useDashboardStatistics = (filters: StatisticsFilters = {}) =>
  useQuery({
    queryKey: [STATISTICS_QUERY_KEY, 'dashboard', filters],
    queryFn: () => statisticsApi.getDashboard(filters),
  });

export const useMostActiveStudents = (filters: StatisticsFilters = {}) =>
  useQuery({
    queryKey: [STATISTICS_QUERY_KEY, 'most-active-students', filters],
    queryFn: () => statisticsApi.getMostActiveStudents(filters),
  });

export const useMostAbsentStudents = (filters: StatisticsFilters = {}) =>
  useQuery({
    queryKey: [STATISTICS_QUERY_KEY, 'most-absent-students', filters],
    queryFn: () => statisticsApi.getMostAbsentStudents(filters),
  });
