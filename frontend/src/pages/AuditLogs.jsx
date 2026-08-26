import { useEffect, useState } from 'react';
import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { auditApi } from '../services/api';

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    auditApi
      .getAuditLogs()
      .then((response) => setAuditLogs(response?.data?.data || []))
      .catch(() => setAuditLogs([]));
  }, []);

  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Review all changes and user actions" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Audit Logs', path: '/audit-logs' }]} />
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search logs" sx={{ width: 260 }} />
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Old Value</TableCell>
              <TableCell>New Value</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(auditLogs || []).map((log) => (
              <TableRow key={log._id || log.id} hover>
                <TableCell>{log.user?.name || 'System'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.oldValue ? JSON.stringify(log.oldValue) : '—'}</TableCell>
                <TableCell>{log.newValue ? JSON.stringify(log.newValue) : '—'}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{log.ipAddress || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
