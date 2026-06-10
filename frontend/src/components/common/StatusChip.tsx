import { Chip } from '@mui/material';
import type { StudentStatus } from '../../types/student';

interface StatusChipProps {
  status: StudentStatus;
  size?: 'small' | 'medium';
}

export const StatusChip = ({ status, size = 'small' }: StatusChipProps) => (
  <Chip
    label={status}
    size={size}
    sx={{
      fontWeight: 600,
      fontSize: '0.7rem',
      letterSpacing: '0.05em',
      borderRadius: '6px',
      bgcolor: status === 'ACTIVE' ? 'rgba(46,196,134,0.12)' : 'rgba(180,180,180,0.15)',
      color: status === 'ACTIVE' ? '#1a9e6a' : '#888',
      border: `1px solid ${status === 'ACTIVE' ? 'rgba(46,196,134,0.3)' : 'rgba(180,180,180,0.3)'}`,
    }}
  />
);
