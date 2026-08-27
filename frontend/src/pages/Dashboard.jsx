import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, Divider, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ArrowUpRight, Boxes, ClipboardList, DollarSign, Download, TrendingUp, Users, Warehouse } from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/charts/StatsCard';
import { inventoryApi, purchaseApi, transferApi, assignmentApi } from '../services/api';
import { dashboardStats, recentActivities, lowStockItems } from '../data/dummyData';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const [inventory, setInventory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, purchasesRes, transfersRes, assignmentsRes] = await Promise.all([
          inventoryApi.getItems(),
          purchaseApi.getPurchases(),
          transferApi.getTransfers(),
          assignmentApi.getAssignments(),
        ]);

        setInventory(itemsRes?.data?.data || []);
        setPurchases(purchasesRes?.data?.data || []);
        setTransfers(transfersRes?.data?.data || []);
        setAssignments(assignmentsRes?.data?.data || []);
      } catch {
        setInventory([]);
        setPurchases([]);
        setTransfers([]);
        setAssignments([]);
      }
    };

    fetchDashboardData();
  }, []);

  const lowStock = useMemo(
    () => (inventory || []).filter((item) => Number(item.quantity) <= Number(item.lowStock || 5)).slice(0, 4),
    [inventory],
  );

  const totalInventory = (inventory || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const statsCards = [
    { title: 'Active Users', value: dashboardStats.totalUsers, change: '+12.5%', icon: <Users size={18} />, color: '#2563EB' },
    { title: 'Inventory Units', value: totalInventory || dashboardStats.totalInventory, change: '+8.2%', icon: <Boxes size={18} />, color: '#14B8A6' },
    { title: 'Purchase Orders', value: purchases.length || dashboardStats.totalPurchases, change: '+16.4%', icon: <DollarSign size={18} />, color: '#F59E0B' },
    { title: 'Assignments', value: assignments.length || dashboardStats.totalAssignments, change: '+4.9%', icon: <ClipboardList size={18} />, color: '#8B5CF6' },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Stock flow',
        data: [1200, 1350, 1480, 1420, 1590, 1710, 1860, 1980],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const categoryData = {
    labels: ['Computers', 'Networking', 'Furniture', 'Mobile'],
    datasets: [
      {
        label: 'Inventory by category',
        data: [42, 19, 17, 12],
        backgroundColor: ['#2563EB', '#14B8A6', '#F59E0B', '#A78BFA'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview for assets, inventory, and movement activity"
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }]}
      />

      <Box
        sx={{
          mb: 1,
          p: 1.25,
          borderRadius: 3,
          border: '1px solid rgba(148,163,184,0.18)',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(20,184,166,0.08), rgba(255,255,255,0.85))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Operational Pulse
          </Typography>
          <Typography variant="h6" fontWeight={800} sx={{ mt: 0.3 }}>
            Asset performance is on track this month
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.1, py: 0.7, borderRadius: 999, background: 'rgba(16,185,129,0.10)', color: 'success.main', fontWeight: 700, fontSize: 12 }}>
            <TrendingUp size={14} />
            +18.4%
          </Box>
          <Button variant="contained" size="small" startIcon={<Download size={14} />} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700, minWidth: 0, px: 1.4 }}>
            Export
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={1.5} sx={{ mb: 1 }}>
        {statsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <StatsCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))', border: '1px solid rgba(148,163,184,0.12)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Inventory flow</Typography>
                <Typography variant="caption" color="text.secondary">Monthly stock</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', fontWeight: 700, fontSize: 12 }}>
                <ArrowUpRight size={14} />
                +7.8%
              </Box>
            </Stack>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false, grid: { display: false } }, y: { display: false, grid: { display: false } } } }} style={{ height: 96 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.92))', border: '1px solid rgba(148,163,184,0.12)' }}>
            <Typography variant="subtitle2" fontWeight={700} mb={0.6}>Category mix</Typography>
            <Box sx={{ height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '68%' }} style={{ height: 96, maxWidth: 112 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <Paper sx={{ p: 1.5, borderRadius: 3, height: '100%', border: '1px solid rgba(148,163,184,0.12)' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Priority alerts</Typography>
            <Stack spacing={0.75}>
              {(lowStock.length ? lowStock : lowStockItems.slice(0, 4)).map((item) => (
                <Card key={item.id || item._id} sx={{ p: 1.2, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Box>
                      <Typography fontWeight={700} sx={{ fontSize: 14 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.category || 'Inventory item'}</Typography>
                    </Box>
                    <Box sx={{ px: 1, py: 0.45, borderRadius: 999, background: 'rgba(245,158,11,0.14)', color: 'warning.main', fontWeight: 700, fontSize: 12 }}>
                      {item.quantity} left
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 1.5, borderRadius: 3, height: '100%', border: '1px solid rgba(148,163,184,0.12)' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Recent activity</Typography>
            <List dense disablePadding>
              {recentActivities.map((activity, idx) => (
                <Box key={idx}>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={activity}
                      secondary="2 hours ago"
                      primaryTypographyProps={{ fontWeight: 600, lineHeight: 1.4, fontSize: 13 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItem>
                  {idx < recentActivities.length - 1 && <Divider flexItem />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 1.5, borderRadius: 3, height: '100%', border: '1px solid rgba(148,163,184,0.12)' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.2}>
              <Typography variant="subtitle1" fontWeight={700}>Warehouse</Typography>
              <Warehouse size={16} color="#2563EB" />
            </Stack>
            <Stack spacing={0.75}>
              <Box sx={{ p: 0.9, borderRadius: 2, background: 'rgba(37,99,235,0.06)' }}>
                <Typography variant="caption" color="text.secondary">Available</Typography>
                <Typography variant="h6" fontWeight={800}>1,284</Typography>
              </Box>
              <Box sx={{ p: 0.9, borderRadius: 2, background: 'rgba(20,184,166,0.06)' }}>
                <Typography variant="caption" color="text.secondary">In transit</Typography>
                <Typography variant="h6" fontWeight={800}>{transfers.length || 42}</Typography>
              </Box>
              <Box sx={{ p: 0.9, borderRadius: 2, background: 'rgba(245,158,11,0.06)' }}>
                <Typography variant="caption" color="text.secondary">Needs attention</Typography>
                <Typography variant="h6" fontWeight={800}>{lowStock.length || 3}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

      </Grid>
    </>
  );
}
