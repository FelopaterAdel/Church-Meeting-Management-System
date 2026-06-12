import {
  Avatar,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { StatusChip } from './StatusChip';
import { MemberActionsMenu } from './MemberActionsMenu';
import type { Member, MemberStatusAction } from '../../types/member';
import type { PaginationMeta } from '../../types/api';

interface MembersTableProps {
  members: Member[];
  pagination: PaginationMeta;
  page: number;
  limit: number;
  canManage: boolean;
  currentUserId?: string;
  actionPending?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onStatusChange: (member: Member, action: MemberStatusAction) => void;
  onRemove: (member: Member) => void;
}

const AVATAR_COLORS = [
  '#4f6ef7',
  '#e05c97',
  '#f79e4f',
  '#2ec486',
  '#8b6ff7',
  '#e5484d',
  '#2f9fbe',
  '#5a7d3b',
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));

const headerCellSx = {
  color: 'text.secondary',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

export const MembersTable = ({
  members,
  pagination,
  page,
  limit,
  canManage,
  currentUserId,
  actionPending = false,
  onPageChange,
  onLimitChange,
  onStatusChange,
  onRemove,
}: MembersTableProps) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={headerCellSx}>Name</TableCell>
            <TableCell sx={headerCellSx}>Email</TableCell>
            <TableCell sx={headerCellSx}>Role</TableCell>
            <TableCell sx={headerCellSx}>Status</TableCell>
            <TableCell sx={headerCellSx}>Created Date</TableCell>
            {canManage && (
              <TableCell align="right" sx={headerCellSx}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canManage ? 6 : 5} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  No members found. Try adjusting the filters.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: avatarColor(member.fullName),
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(member.fullName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {member.fullName}
                      </Typography>
                      {member.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {member.phone}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {member.role.replace('_', ' ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={member.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(member.createdAt)}
                  </Typography>
                </TableCell>
                {canManage && (
                  <TableCell align="right">
                    <MemberActionsMenu
                      member={member}
                      isSelf={member.id === currentUserId}
                      disabled={actionPending}
                      onStatusChange={onStatusChange}
                      onRemove={onRemove}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={pagination.total}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25, 50]}
      onPageChange={(_, nextPage) => onPageChange(nextPage)}
      onRowsPerPageChange={(event) => onLimitChange(Number(event.target.value))}
      sx={{ borderTop: '1px solid', borderColor: 'divider' }}
    />
  </Paper>
);
