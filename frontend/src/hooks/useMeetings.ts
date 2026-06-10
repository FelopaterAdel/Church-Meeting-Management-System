import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '../api/meetings';
import type { MeetingFormData, MeetingsListParams } from '../types/meeting';

export const MEETINGS_QUERY_KEY = 'meetings';

export const useMeetings = (params: MeetingsListParams) =>
  useQuery({
    queryKey: [MEETINGS_QUERY_KEY, params],
    queryFn: () => meetingsApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useMeeting = (id: string) =>
  useQuery({
    queryKey: [MEETINGS_QUERY_KEY, id],
    queryFn: () => meetingsApi.getById(id),
    enabled: !!id,
  });

export const useCreateMeeting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MeetingFormData) => meetingsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY] }),
  });
};

export const useUpdateMeeting = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<MeetingFormData>) => meetingsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY, id] });
    },
  });
};

export const useCloseMeeting = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => meetingsApi.close(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY, id] });
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useReopenMeeting = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => meetingsApi.reopen(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [MEETINGS_QUERY_KEY, id] });
    },
  });
};
