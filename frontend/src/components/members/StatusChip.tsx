import { Chip } from '@mui/material';
import type { UserStatus } from '../../types/member';

const STATUS_STYLES: Record<UserStatus, { bg: string; color: string; border: string }> = {
  PENDING: {
    bg: 'rgba(247, 158, 79, 0.12)',
    color: '#b45f0b',
    border: 'rgba(247, 158, 79, 0.32)',
  },
  APPROVED: {
    bg: 'rgba(46, 196, 134, 0.12)',
    color: '#1a8f61',
    border: 'rgba(46, 196, 134, 0.32)',
  },
  SUSPENDED: {
    bg: 'rgba(99, 115, 129, 0.12)',
    color: '#56616d',
    border: 'rgba(99, 115, 129, 0.32)',
  },
  REJECTED: {
    bg: 'rgba(229, 72, 77, 0.12)',
    color: '#b4232a',
    border: 'rgba(229, 72, 77, 0.32)',
  },
};

export const StatusChip = ({ status }: { status: UserStatus }) => {
  const style = STATUS_STYLES[status];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        borderRadius: '6px',
        fontSize: '0.7rem',
        fontWeight: 700,
      }}
    />
  );
};
