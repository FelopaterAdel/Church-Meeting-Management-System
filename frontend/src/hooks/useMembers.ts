import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { membersApi } from '../api/members';
import type { MemberStatusAction, MembersListParams } from '../types/member';

export const MEMBERS_QUERY_KEY = 'members';

export const useMembers = (params: MembersListParams) =>
  useQuery({
    queryKey: [MEMBERS_QUERY_KEY, params],
    queryFn: () => membersApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useUpdateMemberStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: MemberStatusAction }) => {
      if (action === 'approve') return membersApi.approve(id);
      if (action === 'reject') return membersApi.reject(id);
      return membersApi.suspend(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [MEMBERS_QUERY_KEY] }),
  });
};

export const useRemoveMember = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MEMBERS_QUERY_KEY] }),
  });
};
