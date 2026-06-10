import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CrossIcon from '@mui/icons-material/Church';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, to: '/' },
  { label: 'Students', icon: <PeopleAltIcon fontSize="small" />, to: '/students' },
];

export const AppLayout = () => {
  const location = useLocation();

  return (
    <Box display="flex" minHeight="100vh" bgcolor="grey.50">
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: '#fff',
          },
        }}
      >
        {/* Logo */}
        <Box px={2.5} py={3} display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: '#4f6ef7', width: 34, height: 34 }}>
            <CrossIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
              Church CMS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Meeting Manager
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ px: 1.5, py: 1.5 }}>
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
            return (
              <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  selected={active}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.9,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(79,110,247,0.1)',
                      color: '#4f6ef7',
                      '& .MuiListItemIcon-root': { color: '#4f6ef7' },
                    },
                    '&.Mui-selected:hover': { bgcolor: 'rgba(79,110,247,0.14)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: active ? '#4f6ef7' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" flexGrow={1} p={4} maxWidth="100%" overflow="auto">
        <Box maxWidth={1200} mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
