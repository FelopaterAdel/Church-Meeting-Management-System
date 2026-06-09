import { Box, Typography, Paper } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';

export const Members = () => {
  return (
    <MainLayout title="Members">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Members
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage church members here.
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="textSecondary">
          No members yet. Add your first member to get started.
        </Typography>
      </Paper>
    </MainLayout>
  );
};

export default Members;
