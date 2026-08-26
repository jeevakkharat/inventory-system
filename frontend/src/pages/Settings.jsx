import { Card, CardContent, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="System preferences and security controls" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Settings', path: '/settings' }]} />
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>General Settings</Typography>
          <Typography color="text.secondary" mt={1}>Configure branding, notification preferences, session timeout, and audit archive policy.</Typography>
        </CardContent>
      </Card>
    </>
  );
}
