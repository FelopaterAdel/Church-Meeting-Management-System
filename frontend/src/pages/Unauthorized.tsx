import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            You don't have permission to access this resource.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;
