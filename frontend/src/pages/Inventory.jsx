import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { inventoryApi } from '../services/api';

const DEFAULT_ITEM_FORM = { name: '', sku: '', quantity: 0, categoryId: '' };

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_ITEM_FORM);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!query) return items;

    return items.filter((item) => {
      const haystack = [
        item.name,
        item.sku,
        item.category?.name,
        item.category,
        item.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, query]);

  const fetchItems = () => {
    inventoryApi
      .getItems()
      .then((response) => setItems(response?.data?.data || []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(DEFAULT_ITEM_FORM);
    setOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingId(item._id || item.id);
    setForm({
      name: item.name || '',
      sku: item.sku || '',
      quantity: item.quantity || 0,
      categoryId: item.category?._id || item.category || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku,
      quantity: Number(form.quantity || 0),
      categoryId: form.categoryId,
    };

    if (!payload.name || !payload.sku || !payload.categoryId) return;

    if (editingId) {
      await inventoryApi.updateItem(editingId, payload);
    } else {
      await inventoryApi.createItem(payload);
    }

    setOpen(false);
    setForm(DEFAULT_ITEM_FORM);
    setEditingId(null);
    fetchItems();
  };

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track stock levels, locations, and item status" breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'Inventory', path: '/items' }]} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <TextField variant="outlined" size="small" placeholder="Search item" sx={{ width: { xs: '100%', md: 260 } }} />
        <TextField select size="small" label="Category" defaultValue="All" sx={{ width: 180 }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Computers">Computers</MenuItem>
          <MenuItem value="Networking">Networking</MenuItem>
        </TextField>
        <TextField select size="small" label="Status" defaultValue="All" sx={{ width: 180 }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="In Stock">In Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
        </TextField>
        <Button variant="contained" sx={{ ml: 'auto' }} onClick={openCreateDialog}>Add Item</Button>
      </Stack>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredItems || []).map((item) => (
              <TableRow key={item._id || item.id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category?.name || item.category || 'General'}</TableCell>
                <TableCell>{item.location || 'Main Warehouse'}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell><StatusBadge label={Number(item.quantity) <= 5 ? 'Low Stock' : 'In Stock'} /></TableCell>
                <TableCell>${item.unitPrice || 0}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => openEditDialog(item)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit inventory item' : 'Add inventory item'}</DialogTitle>
        <DialogContent>
          <Stack component="form" id="item-form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 1 }}>
            <TextField label="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
            <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth required />
            <TextField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth required />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="item-form" variant="contained">{editingId ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
