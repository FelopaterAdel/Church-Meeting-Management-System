import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useStudentQRCode } from '../../hooks/useStudents';

type StudentQRCodeProps = {
  studentId: string;
  studentName: string;
  qrCode: string;
};

export const StudentQRCode = ({ studentId, studentName, qrCode }: StudentQRCodeProps) => {
  const { data, isLoading, isError, refetch } = useStudentQRCode(studentId);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <QrCode2Icon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Student QR Code
          </Typography>
        </Stack>

        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Scan this image on the meeting attendance page
          </Typography>
        </Box>

        <Box
          sx={{
            width: 240,
            minHeight: 240,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: '#fff',
            display: 'grid',
            placeItems: 'center',
            p: 1.5,
          }}
        >
          {isLoading && <CircularProgress />}
          {isError && (
            <Alert severity="error" action={undefined} sx={{ textAlign: 'left' }}>
              Failed to load QR image.
              <Typography
                component="button"
                type="button"
                onClick={() => void refetch()}
                sx={{
                  display: 'block',
                  mt: 1,
                  p: 0,
                  border: 0,
                  bgcolor: 'transparent',
                  color: 'primary.main',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: 700,
                }}
              >
                Retry
              </Typography>
            </Alert>
          )}
          {data?.qrImage && (
            <Box
              component="img"
              src={data.qrImage}
              alt={`${studentName} QR code`}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
          }}
        >
          {qrCode}
        </Box>
      </Stack>
    </Paper>
  );
};
