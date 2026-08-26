import { Chip } from '@mui/material';

const palette = {
  Active: 'success',
  Approved: 'success',
  Completed: 'success',
  Assigned: 'primary',
  'In Stock': 'success',
  'Low Stock': 'warning',
  Pending: 'warning',
  Rejected: 'error',
  Inactive: 'default',
  Returned: 'info',
  Cancelled: 'default',
};

export default function StatusBadge({ label }) {
  return <Chip label={label} color={palette[label] || 'default'} size="small" variant={label === 'Inactive' ? 'outlined' : 'filled'} />;
}
