export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}) : '—');

export const formatShortDate = (value) => (value ? new Date(value).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
}) : '—');

export const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);
