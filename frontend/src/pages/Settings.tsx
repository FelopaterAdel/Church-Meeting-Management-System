import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <MainLayout title="Settings">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your account settings.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Account Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={user?.name || ''}
            disabled
          />

          <TextField
            fullWidth
            label="Email"
            value={user?.email || ''}
            disabled
          />

          <TextField
            fullWidth
            label="Role"
            value={user?.role || ''}
            disabled
          />

          <Button variant="contained" sx={{ mt: 2 }}>
            Update Profile
          </Button>
        </Box>
      </Paper>
    </MainLayout>
  );
};

export default Settings;
