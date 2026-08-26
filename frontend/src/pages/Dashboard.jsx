import { useEffect, useMemo, useState } from 'react';
import { Box, Card, Divider, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ArrowUpRight, Boxes, ClipboardList, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, Tooltip } from 'chart.js';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/charts/StatsCard';
import { inventoryApi, purchaseApi, transferApi, assignmentApi, auditApi } from '../services/api';
import { dashboardStats, recentActivities, lowStockItems, auditLogs } from '../data/dummyData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const [inventory, setInventory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, purchasesRes, transfersRes, assignmentsRes, auditRes] = await Promise.all([
          inventoryApi.getItems(),
          purchaseApi.getPurchases(),
          transferApi.getTransfers(),
          assignmentApi.getAssignments(),
          auditApi.getAuditLogs(),
        ]);

        setInventory(itemsRes?.data?.data || []);
        setPurchases(purchasesRes?.data?.data || []);
        setTransfers(transfersRes?.data?.data || []);
        setAssignments(assignmentsRes?.data?.data || []);
        setAudit(auditRes?.data?.data || []);
      } catch {
        setInventory([]);
        setPurchases([]);
        setTransfers([]);
        setAssignments([]);
        setAudit([]);
      }
    };

    fetchDashboardData();
  }, []);

  const lowStock = useMemo(
    () => (inventory || []).filter((item) => Number(item.quantity) <= Number(item.lowStock || 5)).slice(0, 4),
    [inventory],
  );

  const cards = [
    { title: 'Total Users', value: dashboardStats.totalUsers, change: '+12.5%', icon: <Users size={18} />, color: '#2563EB' },
    { title: 'Total Inventory', value: (inventory || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0), change: '+8.2%', icon: <Boxes size={18} />, color: '#14B8A6' },
    { title: 'Total Purchases', value: purchases.length || dashboardStats.totalPurchases, change: '+16.4%', icon: <DollarSign size={18} />, color: '#F59E0B' },
    { title: 'Total Assignments', value: assignments.length || dashboardStats.totalAssignments, change: '+4.9%', icon: <ClipboardList size={18} />, color: '#8B5CF6' },
    { title: 'Total Transfers', value: transfers.length || dashboardStats.totalTransfers, change: '+7.8%', icon: <ArrowUpRight size={18} />, color: '#EC4899' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Purchases',
        data: [2100, 2400, 2800, 2300, 3300, 2900, 3400, 3800],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.18)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Computers', 'Networking', 'Furniture', 'Mobile'],
    datasets: [
      {
        label: 'Inventory by Category',
        data: [42, 19, 17, 12],
        backgroundColor: ['#2563EB', '#14B8A6', '#F59E0B', '#A78BFA'],
        borderWidth: 0,
      },
    ],
  };

  const auditList = audit.slice(0, 4) || auditLogs;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Real-time visibility across inventory, assets, and operational performance" breadcrumbs={[{ label: 'Home', path: '/dashboard' }]} />

      <Box sx={{ mb: 3, p: 2.5, borderRadius: 4, background: 'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(20,184,166,0.08))', border: '1px solid rgba(148,163,184,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>Operational pulse</Typography>
          <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>Everything is running smoothly</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.8, borderRadius: 999, background: 'rgba(16,185,129,0.10)', color: 'success.main', fontWeight: 700 }}>
          <TrendingUp size={16} />
          18.4% above target
        </Box>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <StatsCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Monthly Purchases</Typography>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(148,163,184,0.12)' } } } }} style={{ height: 260 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Inventory by Category</Typography>
            <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} style={{ height: 240 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Recent Activities</Typography>
            <List dense>
              {recentActivities.map((activity, idx) => (
                <Box key={idx}>
                  <ListItem disablePadding sx={{ py: 1.1 }}>
                    <ListItemText
                      primary={activity}
                      secondary="2 hours ago"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {idx < recentActivities.length - 1 && <Divider flexItem />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Low Stock Items</Typography>
            <Stack spacing={2}>
              {(lowStock.length ? lowStock : lowStockItems.slice(0, 4)).map((item) => (
                <Card key={item.id || item._id} sx={{ p: 1.5, bgcolor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={700}>{item.name}</Typography>
                    <Typography color="warning.main" fontWeight={700}>{item.quantity} left</Typography>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Recent Audit Logs</Typography>
            <Stack spacing={1.5}>
              {(auditList || auditLogs).map((log) => (
                <Box key={log.id || log._id} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.08)' }}>
                  <Typography variant="subtitle2" fontWeight={700}>{log.user?.name || log.user || 'System'}</Typography>
                  <Typography variant="caption" color="text.secondary">{log.action || 'Activity'}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
