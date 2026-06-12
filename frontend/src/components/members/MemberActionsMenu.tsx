import { useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Member, MemberStatusAction } from '../../types/member';

interface MemberActionsMenuProps {
  member: Member;
  isSelf?: boolean;
  disabled?: boolean;
  onStatusChange: (member: Member, action: MemberStatusAction) => void;
  onRemove: (member: Member) => void;
}

const getStatusActions = (member: Member): Array<{
  action: MemberStatusAction;
  label: string;
  icon: typeof CheckCircleIcon;
}> => {
  if (member.status === 'PENDING') {
    return [
      { action: 'approve', label: 'Approve', icon: CheckCircleIcon },
      { action: 'reject', label: 'Reject', icon: BlockIcon },
    ];
  }

  if (member.status === 'APPROVED') {
    return [{ action: 'suspend', label: 'Suspend', icon: BlockIcon }];
  }

  if (member.status === 'SUSPENDED') {
    return [{ action: 'approve', label: 'Reactivate', icon: CheckCircleIcon }];
  }

  return [];
};

export const MemberActionsMenu = ({
  member,
  isSelf = false,
  disabled = false,
  onStatusChange,
  onRemove,
}: MemberActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const statusActions = getStatusActions(member);

  const close = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Member actions">
        <span>
          <IconButton
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disabled={disabled}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {statusActions.map(({ action, label, icon: Icon }) => (
          <MenuItem
            key={action}
            onClick={() => {
              close();
              onStatusChange(member, action);
            }}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          disabled={isSelf}
          onClick={() => {
            close();
            onRemove(member);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isSelf ? 'Cannot remove yourself' : 'Remove'}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
