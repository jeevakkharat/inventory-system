import { useEffect, useState } from 'react';
import { Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { transferApi } from '../services/api';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);

  const fetchTransfers = () => {
    transferApi
      .getTransfers()
      .then((response) => setTransfers(response?.data?.data || []))
      .catch(() => setTransfers([]));
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await transferApi.updateTransfer(id, { status });
    fetchTransfers();
  };

  return (
    <>
      <PageHeader title="Transfers" subtitle="Approve, track, and audit inventory movements" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Transfers', path: '/transfers' }]} />
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search transfer" sx={{ width: 260 }} />
        <Button variant="contained">New Transfer</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(transfers || []).map((transfer) => (
              <TableRow key={transfer._id || transfer.id} hover>
                <TableCell>{transfer.item?.name || 'Item'}</TableCell>
                <TableCell>{transfer.sourceLocation?.name || 'Source'}</TableCell>
                <TableCell>{transfer.destinationLocation?.name || 'Destination'}</TableCell>
                <TableCell>{transfer.quantity}</TableCell>
                <TableCell>{new Date(transfer.createdAt || transfer.date).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge label={transfer.status || 'Pending'} /></TableCell>
                <TableCell>
                  <TextField select size="small" value={transfer.status || 'PENDING'} onChange={(event) => handleStatusUpdate(transfer._id, event.target.value)}>
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="IN_TRANSIT">IN_TRANSIT</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="REJECTED">REJECTED</MenuItem>
                  </TextField>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
