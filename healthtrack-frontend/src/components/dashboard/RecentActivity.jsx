import React from 'react';
import { Flame, Utensils, Scale, Clock, Trash } from 'lucide-react';

const RecentActivity = ({ entries = [], onDeleteEntry }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'workout': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'meal': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'weight': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'workout': return Flame;
      case 'meal': return Utensils;
      case 'weight': return Scale;
      default: return Clock;
    }
  };

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Recent Activity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stream of your latest logged activities</p>
            </div>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No activities logged today yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((item) => {
              const Icon = getIcon(item.type);
              return (
                <div 
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-750/30 border border-gray-100/50 dark:border-gray-700/50 rounded-2xl hover:shadow-sm transition-all"
                >
                  <div className="flex gap-3.5 items-center">
                    <div className={`p-2.5 rounded-xl border ${getTypeColor(item.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-850 dark:text-gray-100 capitalize">
                        {item.type === 'workout' && `${item.workoutType || 'Workout'}`}
                        {item.type === 'meal' && `${item.mealType || 'Meal'}`}
                        {item.type === 'weight' && 'Weight Checked'}
                      </p>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        ⏱️ {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.placeName && `| 📍 ${item.placeName}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-100">
                        {item.type === 'workout' && `${item.durationMin} mins`}
                        {item.type === 'meal' && `${item.caloriesConsumed} kcal`}
                        {item.type === 'weight' && `${item.weightKg} kg`}
                      </p>
                      {item.type === 'workout' && (
                        <span className="text-[10px] font-bold text-orange-500">
                          -{item.caloriesBurned} kcal
                        </span>
                      )}
                    </div>
                    {onDeleteEntry && (
                      <button 
                        onClick={() => onDeleteEntry(item._id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Delete log"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default RecentActivity;
