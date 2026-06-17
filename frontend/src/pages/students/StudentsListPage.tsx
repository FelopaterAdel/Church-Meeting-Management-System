import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudents, useDeleteStudent } from '../../hooks/useStudents';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusChip } from '../../components/common/StatusChip';
import { LoadingState, ErrorState } from '../../components/common/StateViews';
import { StudentsFilters } from '../../components/students/StudentsFilters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import type { StudentStatus } from '../../types/student';
import { useDebounce } from '../../hooks/useDebounce';
import { useStages } from '../../hooks/useStages';
import MainLayout from '../../components/Layout/MainLayout';

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');

const AVATAR_COLORS = [
  '#4f6ef7', '#e05c97', '#f79e4f', '#4fc9a4', '#a46ef7',
  '#f7574f', '#4fb8f7', '#7ec44f',
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function StudentsListPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [stageId, setStageId] = useState('');
  const [status, setStatus] = useState<StudentStatus | ''>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 350);
  const { data: stages = [] } = useStages();
  const stageNameById = new Map(stages.map((stage) => [stage.id, stage.name]));

  const { data, isLoading, isError, refetch } = useStudents({
    page: page + 1,
    limit,
    search: debouncedSearch || undefined,
    stageId: stageId || undefined,
    status: status || undefined,
  });

  const deleteMutation = useDeleteStudent();

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <MainLayout title="Meetings">
          <PageHeader
            title="Students"
            subtitle={data ? `${data.pagination.total} students registered` : undefined}
            action={
               <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/students/create')}
            disableElevation
            sx={{ borderRadius: 2 }}
          >
            Add Student
          </Button>
            }
          />
    <Box>
      
      <StudentsFilters
        search={search}
        stageId={stageId}
        status={status}
        stages={stages}
        onSearchChange={(v) => { setSearch(v); setPage(0); }}
        onStageChange={(v) => { setStageId(v); setPage(0); }}
        onStatusChange={(v) => { setStatus(v); setPage(0); }}
      />

      {isLoading ? (
        <LoadingState message="Loading students…" />
      ) : isError ? (
        <ErrorState message="Failed to load students." onRetry={refetch} />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Student
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Stage
                  </TableCell>
                  
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        No students found. Try adjusting the filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.students.map((student) => (
                    <TableRow
                      key={student.id}
                      hover
                      sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              bgcolor: avatarColor(student.fullName),
                            }}
                          >
                          {getInitials(student.fullName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {student.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.confessionFather}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {student.phoneNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stageNameById.get(student.stageId) ?? student.stageId}
                          size="small"
                          sx={{ borderRadius: '6px', fontWeight: 500, fontSize: '0.72rem', bgcolor: 'rgba(79,110,247,0.08)', color: '#4f6ef7' }}
                        />
                      </TableCell>
                     
                      <TableCell>
                        <StatusChip status={student.status} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => navigate(`/students/${student.id}`)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/students/${student.id}/edit`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              sx={{ color: 'error.light', '&:hover': { bgcolor: 'error.50' } }}
                              onClick={() => setDeleteId(student.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {data && (
            <TablePagination
              component="div"
              count={data.pagination.total}
              page={page}
              rowsPerPage={limit}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPageOptions={[5, 10, 25, 50]}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{ borderTop: '1px solid', borderColor: 'divider' }}
            />
          )}
        </Paper>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Student"
        message="The student will be removed from active student lists."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
    </MainLayout>
  );
}
