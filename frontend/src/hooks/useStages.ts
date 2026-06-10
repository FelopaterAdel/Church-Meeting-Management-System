import { useQuery } from '@tanstack/react-query';
import { stagesApi } from '../api/stages';

export const STAGES_QUERY_KEY = 'stages';

export const useStages = () =>
  useQuery({
    queryKey: [STAGES_QUERY_KEY],
    queryFn: stagesApi.getAll,
  });
