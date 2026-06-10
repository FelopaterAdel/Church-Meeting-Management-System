import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  action?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, breadcrumbs, action }: PageHeaderProps) => (
  <Box mb={4}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <Breadcrumbs sx={{ mb: 1, fontSize: '0.8rem' }}>
        {breadcrumbs.map((crumb, i) =>
          crumb.to ? (
            <MuiLink
              key={i}
              component={Link}
              to={crumb.to}
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: '0.8rem' }}
            >
              {crumb.label}
            </MuiLink>
          ) : (
            <Typography key={i} color="text.primary" sx={{ fontSize: '0.8rem' }}>
              {crumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )}
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Box>
  </Box>
);
