import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { inventoryApi, purchaseApi } from '../services/api';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ supplierId: 'Supplier-01', itemId: '', quantity: 1, unitPrice: 0 });

  const fetchData = () => {
    Promise.all([
      purchaseApi.getPurchases(),
      inventoryApi.getItems(),
    ])
      .then(([purchaseRes, itemRes]) => {
        setPurchases(purchaseRes?.data?.data || []);
        setItems(itemRes?.data?.data || []);
        if (!form.itemId && (itemRes?.data?.data || []).length) {
          setForm((current) => ({ ...current, itemId: itemRes.data.data[0]._id }));
        }
      })
      .catch(() => {
        setPurchases([]);
        setItems([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await purchaseApi.createPurchase({
      supplierId: form.supplierId,
      items: [{
        itemId: form.itemId,
        quantity: Number(form.quantity || 1),
        unitPrice: Number(form.unitPrice || 0),
      }],
    });

    setOpen(false);
    setForm({ supplierId: 'Supplier-01', itemId: items[0]?._id || '', quantity: 1, unitPrice: 0 });
    fetchData();
  };

  return (
    <>
      <PageHeader title="Purchases" subtitle="Review purchase orders and supplier activity" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Purchases', path: '/purchases' }]} />
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search purchase" sx={{ width: 260 }} />
        <Button variant="contained" onClick={() => setOpen(true)}>New Purchase</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(purchases || []).map((purchase) => {
              const lineItem = purchase.items?.[0];
              const itemName = lineItem?.item?.name || 'Multiple items';
              const quantity = lineItem?.quantity || 0;
              const total = Number(purchase.totalAmount || 0);

              return (
                <TableRow key={purchase._id || purchase.id} hover>
                  <TableCell>{purchase.supplierId || 'Supplier'}</TableCell>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>${total.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge label={purchase.status || 'Completed'} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create purchase</DialogTitle>
        <DialogContent>
          <Stack component="form" id="create-purchase-form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
            <TextField label="Supplier ID" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} fullWidth required />
            <TextField select label="Item" value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} fullWidth required>
              {(items || []).map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
              ))}
            </TextField>
            <TextField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth required />
            <TextField label="Unit Price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} fullWidth required />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="create-purchase-form" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
