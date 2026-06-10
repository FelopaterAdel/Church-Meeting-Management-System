import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import MainLayout from '../../components/Layout/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { ErrorState, LoadingState } from '../../components/common/StateViews';
import { useDebounce } from '../../hooks/useDebounce';
import { useMeetings } from '../../hooks/useMeetings';
import { useStages } from '../../hooks/useStages';
import type { MeetingStatus } from '../../types/meeting';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function MeetingsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [stageId, setStageId] = useState('');
  const [status, setStatus] = useState<MeetingStatus | ''>('');
  const debouncedSearch = useDebounce(search, 350);

  const { data: stages = [] } = useStages();
  const { data, isLoading, isError, refetch } = useMeetings({
    page: page + 1,
    limit,
    search: debouncedSearch || undefined,
    stageId: stageId || undefined,
    status: status || undefined,
  });

  const stageById = useMemo(() => new Map(stages.map((stage) => [stage.id, stage.name])), [stages]);

  return (
    <MainLayout title="Meetings">
      <PageHeader
        title="Meetings"
        subtitle={data ? `${data.pagination.total} meetings found` : 'Open, close, and track attendance by meeting'}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/meetings/create')}
            disableElevation
          >
            Create Meeting
          </Button>
        }
      />

      <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Search meetings"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="stage-filter-label">Stage</InputLabel>
            <Select
              labelId="stage-filter-label"
              label="Stage"
              value={stageId}
              onChange={(event) => {
                setStageId(event.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All stages</MenuItem>
              {stages.map((stage) => (
                <MenuItem key={stage.id} value={stage.id}>
                  {stage.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as MeetingStatus | '');
                setPage(0);
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {isLoading ? (
        <LoadingState message="Loading meetings..." />
      ) : isError ? (
        <ErrorState message="Failed to load meetings." onRetry={refetch} />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Meeting</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stage</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No meetings match the current filters.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.meetings.map((meeting) => (
                    <TableRow
                      key={meeting.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/meetings/${meeting.id}`)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <EventIcon color="primary" fontSize="small" />
                          <Typography fontWeight={600}>{meeting.meetingName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatDate(meeting.date)}</TableCell>
                      <TableCell>{stageById.get(meeting.stageId) ?? meeting.stageId}</TableCell>
                      <TableCell>
                        <Chip
                          label={meeting.status}
                          color={meeting.status === 'OPEN' ? 'success' : 'default'}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                        <Tooltip title="View meeting">
                          <IconButton onClick={() => navigate(`/meetings/${meeting.id}`)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
              rowsPerPageOptions={[5, 10, 25, 50]}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(0);
              }}
            />
          )}
        </Paper>
      )}
    </MainLayout>
  );
}
