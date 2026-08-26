import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { assignmentApi, inventoryApi, userApi } from '../services/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ itemId: '', userId: '' });

  const fetchData = () => {
    Promise.all([
      assignmentApi.getAssignments(),
      inventoryApi.getItems(),
      userApi.getUsers(),
    ])
      .then(([assignmentRes, itemRes, userRes]) => {
        setAssignments(assignmentRes?.data?.data || []);
        setItems(itemRes?.data?.data || []);
        setUsers(userRes?.data?.data || []);
        if (!(form.itemId || form.userId) && (itemRes?.data?.data || []).length && (userRes?.data?.data || []).length) {
          setForm({ itemId: itemRes.data.data[0]._id, userId: userRes.data.data[0].id || userRes.data.data[0]._id });
        }
      })
      .catch(() => {
        setAssignments([]);
        setItems([]);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await assignmentApi.createAssignment({ itemId: form.itemId, userId: form.userId });
    setOpen(false);
    setForm({ itemId: items[0]?._id || '', userId: users[0]?.id || users[0]?._id || '' });
    fetchData();
  };

  return (
    <>
      <PageHeader title="Assignments" subtitle="Manage assigned assets and return schedules" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Assignments', path: '/assignments' }]} />
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search assignment" sx={{ width: 260 }} />
        <Button variant="contained" onClick={() => setOpen(true)}>Assign Asset</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Assigned Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(assignments || []).map((assignment) => (
              <TableRow key={assignment._id || assignment.id} hover>
                <TableCell>{assignment.item?.name || 'Asset'}</TableCell>
                <TableCell>{assignment.user?.name || 'Employee'}</TableCell>
                <TableCell>{assignment.department || 'Operations'}</TableCell>
                <TableCell>{new Date(assignment.assignedAt || assignment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{assignment.returnedAt ? new Date(assignment.returnedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell><StatusBadge label={assignment.status === 'RETURNED' ? 'Returned' : 'Assigned'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create assignment</DialogTitle>
        <DialogContent>
          <Stack component="form" id="create-assignment-form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Asset" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} fullWidth required>
              {(items || []).map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Employee" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} fullWidth required>
              {(users || []).map((user) => (
                <MenuItem key={user.id || user._id} value={user.id || user._id}>{user.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="create-assignment-form" variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
