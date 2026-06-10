import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { label: 'Students', icon: <SchoolIcon />, path: '/students' },
    { label: 'Meetings', icon: <EventAvailableIcon />, path: '/meetings' },
    { label: 'Members', icon: <PeopleIcon />, path: '/members' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
