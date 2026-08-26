import { Card, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { roles, permissionMatrix } from '../data/dummyData';

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Role Management" subtitle="View access permissions and role assignments" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Roles', path: '/roles' }]} />
      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} key={role.id}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>{role.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{role.description}</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Permission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(permissionMatrix[role.name] || []).map((permission) => (
                    <TableRow key={permission}>
                      <TableCell>{permission}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
