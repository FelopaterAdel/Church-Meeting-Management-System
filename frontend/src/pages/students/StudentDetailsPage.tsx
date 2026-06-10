import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Stack,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useStudent } from '../../hooks/useStudents';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusChip } from '../../components/common/StatusChip';
import { LoadingState, ErrorState } from '../../components/common/StateViews';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box sx={{ color: 'text.disabled', mt: 0.2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} mt={0.2}>
        {value || <span style={{ color: '#bbb' }}>—</span>}
      </Typography>
    </Box>
  </Stack>
);

const AVATAR_COLORS = ['#4f6ef7', '#e05c97', '#f79e4f', '#4fc9a4', '#a46ef7'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');

export default function StudentDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading, isError, refetch } = useStudent(id);

  if (isLoading) return <LoadingState message="Loading student…" />;
  if (isError || !student) return <ErrorState message="Student not found." onRetry={refetch} />;

  return (
    <Box>
      <PageHeader
        title="Student Profile"
        breadcrumbs={[
          { label: 'Students', to: '/students' },
          { label: student.fullName },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/students')}
              sx={{ borderRadius: 2 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/students/${id}/edit`)}
              disableElevation
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        {/* Left: Identity Card */}
        <Box>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(79,110,247,0.04) 0%, rgba(255,255,255,0) 60%)',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 700,
                bgcolor: avatarColor(student.fullName),
                mx: 'auto',
                mb: 2,
              }}
            >
              {getInitials(student.fullName)}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {student.fullName}
            </Typography>
            <Box mt={1} mb={2}>
              <StatusChip status={student.status} size="medium" />
            </Box>
            <Chip
              label={student.stage}
              size="small"
              icon={<SchoolIcon style={{ fontSize: 14 }} />}
              sx={{
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '0.72rem',
                bgcolor: 'rgba(79,110,247,0.08)',
                color: '#4f6ef7',
              }}
            />

            <Divider sx={{ my: 3 }} />

            {/* QR Code display */}
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1.5}>
                <QrCode2Icon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                  QR Code
                </Typography>
              </Stack>
              {student.qrCode ? (
                <Box
                  component="img"
                  src={student.qrCode}
                  alt="Student QR Code"
                  sx={{
                    width: 160,
                    height: 160,
                    objectFit: 'contain',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1,
                    bgcolor: '#fff',
                  }}
                  onError={(e) => {
                    // Fallback: show placeholder if QR is a data URL or URL that fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 160,
                    height: 160,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mx: 'auto',
                    color: 'text.disabled',
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 40 }} />
                  <Typography variant="caption">Not generated</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Student Code */}
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                <FingerprintIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                  Student Code
                </Typography>
              </Stack>
              <Box
                sx={{
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  px: 2,
                  py: 1,
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'text.primary',
                }}
              >
                {student.studentCode || '—'}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right: Details */}
        <Box>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={3} textTransform="uppercase" letterSpacing="0.06em">
              Contact & Personal Info
            </Typography>

            <Stack spacing={3}>
              <InfoRow
                icon={<PhoneIcon fontSize="small" />}
                label="Phone Number"
                value={
                  <Typography component="span" fontFamily="monospace" variant="body2" fontWeight={500}>
                    {student.phoneNumber}
                  </Typography>
                }
              />
              <InfoRow
                icon={<SchoolIcon fontSize="small" />}
                label="Confession Father"
                value={student.confessionFather}
              />
              <InfoRow
                icon={<LocationOnIcon fontSize="small" />}
                label="Address"
                value={student.address}
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={3} textTransform="uppercase" letterSpacing="0.06em">
              Academic Info
            </Typography>

            <Stack spacing={3}>
              <InfoRow
                icon={<SchoolIcon fontSize="small" />}
                label="Stage"
                value={
                  <Chip
                    label={student.stage}
                    size="small"
                    sx={{ borderRadius: '6px', fontWeight: 500, fontSize: '0.75rem', bgcolor: 'rgba(79,110,247,0.08)', color: '#4f6ef7' }}
                  />
                }
              />
              <InfoRow
                icon={<FingerprintIcon fontSize="small" />}
                label="Student Code"
                value={
                  <Typography component="span" fontFamily="monospace" variant="body2" fontWeight={600}>
                    {student.studentCode}
                  </Typography>
                }
              />
            </Stack>

            {(student.latitude || student.longitude) && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={3} textTransform="uppercase" letterSpacing="0.06em">
                  Location
                </Typography>
                <Stack spacing={3}>
                  <InfoRow
                    icon={<LocationOnIcon fontSize="small" />}
                    label="Coordinates"
                    value={
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography component="span" fontFamily="monospace" variant="body2">
                          {student.latitude?.toFixed(6)}, {student.longitude?.toFixed(6)}
                        </Typography>
                        <Tooltip title="Open in Google Maps">
                          <Button
                            size="small"
                            variant="outlined"
                            href={`https://maps.google.com/?q=${student.latitude},${student.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            sx={{ borderRadius: 1.5, fontSize: '0.7rem' }}
                          >
                            Maps
                          </Button>
                        </Tooltip>
                      </Stack>
                    }
                  />
                </Stack>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
