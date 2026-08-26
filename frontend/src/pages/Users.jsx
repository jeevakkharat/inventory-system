import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { userApi } from '../services/api';

const defaultForm = {
  name: '',
  email: '',
  password: '',
  roleId: '68a292c5a8fd3c5d1dcf4b8a',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!query) return users;

    return users.filter((user) => {
      const haystack = [user.name, user.email, user.role, user.status].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [users, query]);

  const fetchUsers = () => {
    userApi
      .getUsers()
      .then((response) => setUsers(response?.data?.data || []))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    await userApi.createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      roleId: form.roleId,
    });
    setOpen(false);
    setForm(defaultForm);
    fetchUsers();
  };

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage system users, roles, and status" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Users', path: '/users' }]} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search users" sx={{ width: 260 }} />
        <Button variant="contained" onClick={() => setOpen(true)}>Add User</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredUsers || []).map((user) => (
              <TableRow key={user.id || user._id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || 'Unknown'}</TableCell>
                <TableCell><StatusBadge label={user.status || 'Active'} /></TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create user</DialogTitle>
        <DialogContent>
          <Stack component="form" id="create-user-form" onSubmit={handleCreate} spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth required />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth required />
            <TextField select label="Role" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} fullWidth>
              <MenuItem value="68a292c5a8fd3c5d1dcf4b8a">Admin</MenuItem>
              <MenuItem value="68a292c5a8fd3c5d1dcf4b8b">Manager</MenuItem>
              <MenuItem value="68a292c5a8fd3c5d1dcf4b8c">Inventory Manager</MenuItem>
              <MenuItem value="68a292c5a8fd3c5d1dcf4b8d">Employee</MenuItem>
              <MenuItem value="68a292c5a8fd3c5d1dcf4b8e">Auditor</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="create-user-form" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
