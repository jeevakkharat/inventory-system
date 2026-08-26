import { Box } from '@mui/material';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function StatsCard({ title, value, change, icon, color = 'primary.main' }) {
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid rgba(148,163,184,0.12)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.94))',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 20px 32px rgba(15,23,42,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: `${color}22`,
              display: 'grid',
              placeItems: 'center',
              color,
              boxShadow: `inset 0 0 0 1px ${color}22`,
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        {change && (
          <Typography variant="caption" color="success.main" fontWeight={700} sx={{ mt: 1, display: 'inline-flex' }}>
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
