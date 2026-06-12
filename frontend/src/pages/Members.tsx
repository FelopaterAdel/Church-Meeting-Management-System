import { useState } from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState, ErrorState } from '../components/common/StateViews';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { MembersTable } from '../components/members/MembersTable';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { useMembers, useRemoveMember, useUpdateMemberStatus } from '../hooks/useMembers';
import type { Member, MemberStatusAction, UserRole, UserStatus } from '../types/member';

const STATUS_OPTIONS: UserStatus[] = ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'];
const ROLE_OPTIONS: UserRole[] = ['SUPER_ADMIN', 'SERVANT'];

const getStatusActionMessage = (action: MemberStatusAction) => {
  if (action === 'approve') return 'Member approved successfully.';
  if (action === 'reject') return 'Member rejected successfully.';
  return 'Member suspended successfully.';
};

export const Members = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'SUPER_ADMIN';

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<UserStatus | ''>('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const debouncedSearch = useDebounce(search, 350);
  const { data, isLoading, isError, refetch } = useMembers({
    page: page + 1,
    limit,
    search: debouncedSearch || undefined,
    status: status || undefined,
    role: role || undefined,
  });
  const updateStatusMutation = useUpdateMemberStatus();
  const removeMemberMutation = useRemoveMember();

  const handleStatusChange = async (member: Member, action: MemberStatusAction) => {
    try {
      await updateStatusMutation.mutateAsync({ id: member.id, action });
      setSnackbar({ message: getStatusActionMessage(action), severity: 'success' });
    } catch {
      setSnackbar({ message: 'Failed to update member status.', severity: 'error' });
    }
  };

  const handleRemove = async () => {
    if (!memberToRemove) return;

    try {
      await removeMemberMutation.mutateAsync(memberToRemove.id);
      setMemberToRemove(null);
      setSnackbar({ message: 'Member removed successfully.', severity: 'success' });
    } catch {
      setSnackbar({ message: 'Failed to remove member.', severity: 'error' });
    }
  };

  return (
    <MainLayout title="Members">
      <PageHeader
        title="Members"
        subtitle={data ? `${data.pagination.total} system users` : 'View registered system users'}
      />

      <Box>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            label="Search members"
            placeholder="Name or email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ flex: 1, minWidth: { md: 280 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 } }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as UserStatus | '');
                setPage(0);
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 } }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value as UserRole | '');
                setPage(0);
              }}
            >
              <MenuItem value="">All roles</MenuItem>
              {ROLE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? (
          <LoadingState message="Loading members..." />
        ) : isError || !data ? (
          <ErrorState message="Failed to load members." onRetry={refetch} />
        ) : (
          <MembersTable
            members={data.members}
            pagination={data.pagination}
            page={page}
            limit={limit}
            canManage={canManage}
            currentUserId={user?.id}
            actionPending={updateStatusMutation.isPending || removeMemberMutation.isPending}
            onPageChange={setPage}
            onLimitChange={(nextLimit) => {
              setLimit(nextLimit);
              setPage(0);
            }}
            onStatusChange={handleStatusChange}
            onRemove={setMemberToRemove}
          />
        )}
      </Box>

      <ConfirmDialog
        open={!!memberToRemove}
        title="Remove Member"
        message={
          memberToRemove
            ? `${memberToRemove.fullName} will no longer appear in member lists or be able to sign in.`
            : ''
        }
        confirmLabel="Remove"
        onConfirm={handleRemove}
        onCancel={() => setMemberToRemove(null)}
        loading={removeMemberMutation.isPending}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </MainLayout>
  );
};

export default Members;
