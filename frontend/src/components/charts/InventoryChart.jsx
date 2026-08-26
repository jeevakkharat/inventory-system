import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export function InventoryBarChart({ data }) {
  return (
    <Box sx={{ height: 280 }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </Box>
  );
}

export function InventoryDonutChart({ data }) {
  return (
    <Box sx={{ height: 260 }}>
      <Bar
        data={data}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
        }}
      />
    </Box>
  );
}
