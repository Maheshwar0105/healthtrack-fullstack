import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, Title, PointElement, LineElement 
} from 'chart.js';
import ProgressChart from '../charts/ProgressChart.jsx';
import ActivityHeatmap from '../charts/ActivityHeatmap.jsx';

// Register elements
ChartJS.register(
  ArcElement, BarElement, CategoryScale, LinearScale, Title, 
  PointElement, LineElement, Tooltip, Legend
);

const AnalyticsSection = ({ progressData, entries = [] }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // 1. Macros Doughnut Data
  const doughnutData = {
    labels: ['Carbs', 'Protein', 'Fats'],
    datasets: [{
      data: [50, 25, 25],
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)',   // Blue
        'rgba(16, 185, 129, 0.85)',  // Emerald
        'rgba(249, 115, 22, 0.85)'   // Orange
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, font: { weight: 'bold', size: 11 } }
      }
    }
  };

  // 2. Sleep Trend Line Data
  const sleepData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sleep Hours',
      data: [7.2, 6.8, 7.5, 6.2, 7.8, 8.5, 7.0],
      borderColor: 'rgba(99, 102, 241, 1)', // Indigo
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const sleepOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { display: false } },
      y: { ticks: { color: textColor }, grid: { color: gridColor }, min: 4 }
    }
  };

  // 3. Goal Completion Data
  const goals = [
    { name: 'Calories Intake', target: 2300, current: 1850, color: 'bg-blue-500' },
    { name: 'Water Target', target: 2500, current: 1800, color: 'bg-cyan-500' },
    { name: 'Active Steps', target: 10000, current: 7234, color: 'bg-green-500' },
    { name: 'Sleep Target', target: 8, current: 7.2, color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Primary Row: Calorie Progression & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {progressData && (
          <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl p-6">
            <h4 className="text-xl font-black mb-4 text-gray-800 dark:text-gray-200">📈 Calories Timeline</h4>
            <div className="h-[300px]">
              <ProgressChart data={progressData.data} metric={progressData.metric} multiMetric={progressData.metric === 'calories'} />
            </div>
          </div>
        )}

        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl p-6">
          <h4 className="text-xl font-black mb-4 text-gray-800 dark:text-gray-200">🔥 Activity Heatmap</h4>
          <div className="flex items-center justify-center h-[300px]">
            <ActivityHeatmap entries={entries} />
          </div>
        </div>
      </div>

      {/* Secondary Row: Macros, Sleep and Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Nutrition Doughnut */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl p-6">
          <h4 className="text-lg font-black mb-4 text-gray-800 dark:text-gray-200">🥗 Nutrition Macro Split</h4>
          <div className="h-[220px] relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl p-6">
          <h4 className="text-lg font-black mb-4 text-gray-800 dark:text-gray-200">🌙 Sleep Quality Trends</h4>
          <div className="h-[220px]">
            <Line data={sleepData} options={sleepOptions} />
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-black mb-4 text-gray-800 dark:text-gray-200">🎯 Goal Completion</h4>
            <div className="space-y-4">
              {goals.map((g, idx) => {
                const pct = Math.min((g.current / g.target) * 100, 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
                      <span>{g.name}</span>
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-750 rounded-full overflow-hidden">
                      <div className={`h-full ${g.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mt-4">
            Goal Metrics Synced Today
          </span>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsSection;
