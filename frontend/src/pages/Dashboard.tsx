import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { ErrorState, LoadingState } from '../components/common/StateViews';
import {
  useDashboardStatistics,
  useMostAbsentStudents,
  useMostActiveStudents,
} from '../hooks/useStatistics';
import type { StudentRankingItem } from '../types/statistics';

export const Dashboard = () => {
  const { user } = useAuth();
  const reportFilters = { limit: 5 };
  const {
    data: statistics,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStatistics();
  const { data: activeStudents = [], isLoading: activeLoading } = useMostActiveStudents(reportFilters);
  const { data: absentStudents = [], isLoading: absentLoading } = useMostAbsentStudents(reportFilters);

  const widgets = statistics
    ? [
        {
          label: 'Total Students',
          value: statistics.totalStudents.toLocaleString(),
          helper: `${statistics.totalActiveStudents.toLocaleString()} active`,
          icon: <GroupsIcon />,
          color: '#2563eb',
        },
        {
          label: 'Attendance',
          value: `${statistics.attendancePercentage}%`,
          helper: `${statistics.totalMeetings.toLocaleString()} meetings tracked`,
          icon: <TrendingUpIcon />,
          color: '#059669',
          progress: statistics.attendancePercentage,
        },
        {
          label: 'Present Count',
          value: statistics.presentCount.toLocaleString(),
          helper: 'Recorded attendance',
          icon: <HowToRegIcon />,
          color: '#0f766e',
        },
        {
          label: 'Absent Count',
          value: statistics.absentCount.toLocaleString(),
          helper: 'Generated absence records',
          icon: <PersonOffIcon />,
          color: '#b45309',
        },
      ]
    : [];

  const displayName = user?.fullName || user?.email || 'Servant';

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome, {displayName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor student attendance and meeting health from one place.
        </Typography>
      </Box>

      {statsLoading ? (
        <LoadingState message="Loading dashboard statistics..." />
      ) : statsError || !statistics ? (
        <ErrorState message="Failed to load dashboard statistics." onRetry={refetchStats} />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2.5,
              mb: 3,
            }}
          >
            {widgets.map((widget) => (
              <Card key={widget.label} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                        {widget.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                        {widget.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${widget.color}14`, color: widget.color }}>{widget.icon}</Avatar>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                    {widget.helper}
                  </Typography>
                  {widget.progress !== undefined && (
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(widget.progress, 100)}
                      sx={{ mt: 1.5, height: 6, borderRadius: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            <RankingPanel
              title="Most Active Students"
              subtitle="Highest present counts"
              students={activeStudents}
              loading={activeLoading}
              emptyText="No present attendance records yet."
              tone="success"
            />
            <RankingPanel
              title="Most Absent Students"
              subtitle="Highest absent counts"
              students={absentStudents}
              loading={absentLoading}
              emptyText="No absence records yet."
              tone="warning"
            />
          </Box>
        </>
      )}
    </MainLayout>
  );
};

interface RankingPanelProps {
  title: string;
  subtitle: string;
  students: StudentRankingItem[];
  loading: boolean;
  emptyText: string;
  tone: 'success' | 'warning';
}

const RankingPanel = ({ title, subtitle, students, loading, emptyText, tone }: RankingPanelProps) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>

    {loading ? (
      <Box sx={{ p: 2.5 }}>
        <LinearProgress />
      </Box>
    ) : (
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Stage</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Count
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                <Typography color="text.secondary">{emptyText}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.studentId} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {student.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {student.internalStudentCode || student.studentId}
                  </Typography>
                </TableCell>
                <TableCell>{student.stageName ?? 'Unassigned'}</TableCell>
                <TableCell align="right">
                  <Chip label={student.count} color={tone} size="small" sx={{ borderRadius: 1, minWidth: 44 }} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )}
  </Paper>
);

export default Dashboard;
