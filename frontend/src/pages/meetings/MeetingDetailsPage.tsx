import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import MainLayout from '../../components/Layout/MainLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { ErrorState, LoadingState } from '../../components/common/StateViews';
import { MeetingForm } from '../../components/meetings/MeetingForm';
import { QRCodeScanner } from '../../components/meetings/QRCodeScanner';
import { useMeetingAttendance, useManualAttendance, useQrAttendance } from '../../hooks/useAttendance';
import { useCloseMeeting, useMeeting, useReopenMeeting, useUpdateMeeting } from '../../hooks/useMeetings';
import { useStages } from '../../hooks/useStages';
import { useDebounce } from '../../hooks/useDebounce';
import { useStudentLookup } from '../../hooks/useStudentLookup';
import type { MeetingFormData } from '../../types/meeting';
import type { Attendance } from '../../types/attendance';
import type { StudentLookupItem } from '../../api/studentLookup';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const toDateTimeLocal = (value: string) => {
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const toApiDate = (value: string) => new Date(value).toISOString();

const statusColor = (status: Attendance['status']) => (status === 'PRESENT' ? 'success' : 'warning');

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error) return error.message;
  return fallback;
};

export default function MeetingDetailsPage() {
  const { id = '' } = useParams();
  const [attendancePage, setAttendancePage] = useState(0);
  const [attendanceLimit, setAttendanceLimit] = useState(10);
  const [qrCode, setQrCode] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentLookupItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const debouncedStudentSearch = useDebounce(studentSearch, 300);
  const { data: meeting, isLoading, isError, refetch } = useMeeting(id);
  const { data: stages = [] } = useStages();
  const updateMeeting = useUpdateMeeting(id);
  const closeMeeting = useCloseMeeting(id);
  const reopenMeeting = useReopenMeeting(id);
  const qrAttendance = useQrAttendance(id);
  const manualAttendance = useManualAttendance(id);

  const { data: attendanceData, isLoading: attendanceLoading, refetch: refetchAttendance } = useMeetingAttendance(id, {
    page: attendancePage + 1,
    limit: attendanceLimit,
  });

  const { data: studentOptions } = useStudentLookup({
    page: 1,
    limit: 20,
    search: debouncedStudentSearch || undefined,
    stageId: meeting?.stageId,
    status: 'ACTIVE',
  });

  const stageById = useMemo(() => new Map(stages.map((stage) => [stage.id, stage.name])), [stages]);
  const meetingIsOpen = meeting?.status === 'OPEN';

  const handleUpdate = async (values: MeetingFormData) => {
    setEditError(null);
    try {
      await updateMeeting.mutateAsync({
        ...values,
        date: toApiDate(values.date),
      });
      setFeedback({ type: 'success', message: 'Meeting updated.' });
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update meeting.');
    }
  };

  const handleClose = async () => {
    setFeedback(null);
    try {
      const result = await closeMeeting.mutateAsync();
      setFeedback({
        type: 'success',
        message: `Meeting closed. ${result.absenceSummary.absenceRecordsCreated} absence records created.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to close meeting.' });
    }
  };

  const handleReopen = async () => {
    setFeedback(null);
    try {
      await reopenMeeting.mutateAsync();
      setFeedback({ type: 'success', message: 'Meeting reopened.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to reopen meeting.' });
    }
  };

  const handleQrSubmit = async () => {
    if (!qrCode.trim()) return;
    setFeedback(null);
    try {
      const attendance = await qrAttendance.mutateAsync(qrCode.trim());
      setQrCode('');
      setFeedback({ type: 'success', message: `${attendance.student.fullName} marked present.` });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err, 'Failed to record QR attendance.') });
    }
  };

  const handleScannedQr = useCallback(async (scannedQrCode: string) => {
    try {
      const attendance = await qrAttendance.mutateAsync(scannedQrCode);
      setSnackbar({ type: 'success', message: `${attendance.student.fullName} marked present.` });
    } catch (err) {
      setSnackbar({ type: 'error', message: getErrorMessage(err, 'Failed to record scanned QR attendance.') });
    }
  }, [qrAttendance]);

  const handleManualSubmit = async () => {
    if (!selectedStudent) return;
    setFeedback(null);
    try {
      await manualAttendance.mutateAsync(selectedStudent.id);
      setSelectedStudent(null);
      setStudentSearch('');
      setFeedback({ type: 'success', message: 'Manual attendance recorded.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err, 'Failed to record manual attendance.') });
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Meeting Details">
        <LoadingState message="Loading meeting..." />
      </MainLayout>
    );
  }

  if (isError || !meeting) {
    return (
      <MainLayout title="Meeting Details">
        <ErrorState message="Failed to load meeting." onRetry={refetch} />
      </MainLayout>
    );
  }
  return (
 <MainLayout title={meeting.meetingName}>
      <PageHeader
        title={meeting.meetingName}
        subtitle={`${formatDate(meeting.date)} - ${stageById.get(meeting.stageId) ?? meeting.stageId}`}
       
        action={
          <Stack direction="row" spacing={1}>
            <Chip
              label={meeting.status}
              color={meeting.status === 'OPEN' ? 'success' : 'default'}
              sx={{ height: 36, borderRadius: 1 }}
            />
            {meetingIsOpen ? (
              <Button
                color="warning"
                variant="contained"
                startIcon={<LockIcon />}
                onClick={handleClose}
                disabled={closeMeeting.isPending}
                disableElevation
              >
                Close Meeting
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<LockOpenIcon />}
                onClick={handleReopen}
                disabled={reopenMeeting.isPending}
              >
                Reopen
              </Button>
            )}
          </Stack>
        }
      />

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }}>
          {feedback.message}
        </Alert>
      )}

      <QRCodeScanner
        open={scannerOpen}
        disabled={!meetingIsOpen}
        loading={qrAttendance.isPending}
        onClose={() => setScannerOpen(false)}
        onScan={handleScannedQr}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3500}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? (
          <Alert severity={snackbar.type} variant="filled" onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1.35fr' }, gap: 3 }}>
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Meeting Information
            </Typography>
            {meetingIsOpen ? (
              <MeetingForm
                stages={stages}
                defaultValues={{
                  meetingName: meeting.meetingName,
                  date: toDateTimeLocal(meeting.date),
                  stageId: meeting.stageId,
                }}
                submitLabel="Save Changes"
                loading={updateMeeting.isPending}
                error={editError}
                onSubmit={handleUpdate}
              />
            ) : (
              <Stack spacing={1}>
                <Typography color="text.secondary">Closed meetings cannot accept attendance or edits.</Typography>
                {meeting.closedAt && <Typography>Closed at: {formatDate(meeting.closedAt)}</Typography>}
              </Stack>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                QR Attendance
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={() => setScannerOpen(true)}
                  disabled={!meetingIsOpen || qrAttendance.isPending}
                  disableElevation
                  sx={{ minWidth: 150 }}
                >
                  Open Camera
                </Button>
                <TextField
                  label="Scan or paste QR value"
                  value={qrCode}
                  onChange={(event) => setQrCode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleQrSubmit();
                    }
                  }}
                  disabled={!meetingIsOpen || qrAttendance.isPending}
                  autoComplete="off"
                  fullWidth
                />
                <Button
                  variant="contained"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={handleQrSubmit}
                  disabled={!meetingIsOpen || qrAttendance.isPending || !qrCode.trim()}
                  disableElevation
                  sx={{ minWidth: 120 }}
                >
                  Record
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Manual Attendance
              </Typography>
              <Autocomplete
                value={selectedStudent}
                onChange={(_, value) => setSelectedStudent(value)}
                inputValue={studentSearch}
                onInputChange={(_, value) => setStudentSearch(value)}
                options={studentOptions?.students ?? []}
                getOptionLabel={(option) => `${option.fullName} (${option.internalStudentCode})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={!meetingIsOpen || manualAttendance.isPending}
                renderInput={(params) => <TextField {...params} label="Search active students in this stage" />}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleManualSubmit}
                  disabled={!meetingIsOpen || manualAttendance.isPending || !selectedStudent}
                  disableElevation
                >
                  Mark Present
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box p={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present and absent records for this meeting
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => void refetchAttendance()}
              >
                Refresh
              </Button>
            </Stack>
          </Box>
          <Divider />
          {attendanceLoading ? (
            <LoadingState message="Loading attendance..." />
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>الوقت والتاريخ </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>الاسم</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData?.attendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <Typography color="text.secondary">No attendance records yet.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceData?.attendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={statusColor(record.status)}
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell>{record.method}</TableCell>
                          <TableCell>{formatDate(record.attendedAt)}</TableCell>
                          <TableCell>
                            <Typography variant="caption" fontFamily="monospace" fontSize={20}>
                              {record.student.fullName}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {attendanceData && (
                <TablePagination
                  component="div"
                  count={attendanceData.pagination.total}
                  page={attendancePage}
                  rowsPerPage={attendanceLimit}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  onPageChange={(_, nextPage) => setAttendancePage(nextPage)}
                  onRowsPerPageChange={(event) => {
                    setAttendanceLimit(Number(event.target.value));
                    setAttendancePage(0);
                  }}
                />
              )}
            </>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
}
