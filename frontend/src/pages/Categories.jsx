import { Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { categories } from '../data/dummyData';

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title="Categories" subtitle="Manage inventory categories and classifications" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Categories', path: '/categories' }]} />
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search categories" sx={{ width: 260 }} />
        <Button variant="contained">Add Category</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell><StatusBadge label={category.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
