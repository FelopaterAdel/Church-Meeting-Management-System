import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Members', value: '0' },
    { label: 'Meetings', value: '0' },
    { label: 'Recent Activity', value: '0' },
  ];

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your church meetings and members efficiently.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {stat.label}
              </Typography>
              <Typography variant="h5">{stat.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Activities
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No recent activities yet.
        </Typography>
      </Paper>
    </MainLayout>
  );
};

export default Dashboard;
