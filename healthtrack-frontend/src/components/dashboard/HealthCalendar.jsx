import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

const HealthCalendar = () => {
  // Current month details
  const daysInMonth = 30;
  const currentDay = new Date().getDate();
  
  // Simulated completed healthy days
  const completedDays = [3, 5, 8, 12, 14, 15, 18, 20, 22, 25, 27];

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Health Calendar</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly tracker showing completed healthy days</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 my-4 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <span key={idx} className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {day}
            </span>
          ))}

          {/* Render 30 days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isToday = dayNum === currentDay;

            return (
              <div 
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-black relative cursor-pointer border select-none transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                    : isToday
                      ? 'bg-theme-gradient text-white border-transparent shadow-md'
                      : 'bg-gray-50/50 dark:bg-gray-750/30 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {dayNum}
                {isCompleted && (
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-500 fill-green-500/20 absolute bottom-1 right-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-green-500/20 border border-green-500/30 rounded-full inline-block" /> Completed Day
        </span>
        <span>{completedDays.length} / {daysInMonth} Completed</span>
      </div>
    </div>
  );
};

export default HealthCalendar;
