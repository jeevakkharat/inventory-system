import { Box, Breadcrumbs, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={1}>
        <Breadcrumbs aria-label="breadcrumb" separator="/">
          {breadcrumbs.map((crumb, idx) => (
            <RouterLink key={idx} to={crumb.path} style={{ textDecoration: 'none', color: idx === breadcrumbs.length - 1 ? '#0F172A' : '#64748B' }}>
              {crumb.label}
            </RouterLink>
          ))}
        </Breadcrumbs>
        <Typography variant="h4" fontWeight={700}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
