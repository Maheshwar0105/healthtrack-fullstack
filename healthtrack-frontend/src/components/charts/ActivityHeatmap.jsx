import { useMemo } from 'react';

const ActivityHeatmap = ({ entries = [], year = new Date().getFullYear() }) => {
  const heatmapData = useMemo(() => {
    const days = {};
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Initialize all days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }

    // Count entries per day
    entries.forEach(entry => {
      const key = new Date(entry.date).toISOString().split('T')[0];
      if (days[key] !== undefined) {
        days[key]++;
      }
    });

    return days;
  }, [entries, year]);

  const getIntensity = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-900';
    if (count === 2) return 'bg-green-400 dark:bg-green-700';
    if (count >= 3) return 'bg-green-600 dark:bg-green-500';
    return 'bg-gray-100 dark:bg-gray-800';
  };

  const weeks = useMemo(() => {
    const weeksArray = [];
    const startDate = new Date(year, 0, 1);
    const firstDay = startDate.getDay();
    
    // Add empty cells for days before Jan 1
    let currentWeek = Array(firstDay).fill(null);
    
    for (let d = new Date(startDate); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
      const key = d.toISOString().split('T')[0];
      currentWeek.push({
        date: key,
        count: heatmapData[key] || 0
      });
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArray.push(currentWeek);
    }
    
    return weeksArray;
  }, [heatmapData, year]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Activity Heatmap {year}</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded ${day ? getIntensity(day.count) : 'bg-transparent'}`}
                  title={day ? `${day.date}: ${day.count} entries` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-900" />
          <div className="w-3 h-3 rounded bg-green-400 dark:bg-green-700" />
          <div className="w-3 h-3 rounded bg-green-600 dark:bg-green-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;

