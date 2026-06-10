import { Box, CircularProgress, Typography, Button } from '@mui/material';
//import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={240}
    gap={2}
  >
    <CircularProgress size={40} thickness={3} sx={{ color: 'primary.main' }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={240}
    gap={2}
  >
    {/* <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.light' }} /> */}
    <Typography variant="body1" color="text.secondary" textAlign="center">
      {message}
    </Typography>
    {onRetry && (
      <Button variant="outlined" size="small" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </Box>
);
