import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ data, metric, multiMetric = false }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  let chartData;
  let datasets = [];

  if (multiMetric && metric === 'calories') {
    datasets = [
      {
        label: 'Calories Consumed',
        data: data.map((d) => d.consumed || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Calories Burned',
        data: data.map((d) => d.burned || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Net Calories',
        data: data.map((d) => d.net || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ];
  } else {
    datasets = [
      {
        label: metric === 'weight' ? 'Weight (kg)' : 'Calories',
        data: data.map((d) => (metric === 'weight' ? d.value : d.net || d.value)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      }
    ];
  }

  chartData = {
    labels: data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor
        }
      },
      title: {
        display: true,
        text: metric === 'weight' ? 'Weight Progress' : 'Calories Progress',
        color: textColor,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
