import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout = ({ children, title }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
//const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuClick={handleMenuClick} title={title} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar open={sidebarOpen && !isMobile} onClose={handleCloseSidebar} />
        
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="lg" sx={{ py: 3 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
