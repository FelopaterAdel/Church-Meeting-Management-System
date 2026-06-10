import { useQuery } from '@tanstack/react-query';
import { studentLookupApi } from '../api/studentLookup';

export const useStudentLookup = (params: {
  page: number;
  limit: number;
  search?: string;
  stageId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}) =>
  useQuery({
    queryKey: ['studentLookup', params],
    queryFn: () => studentLookupApi.search(params),
    enabled: !!params.stageId,
  });
