import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Flame, Utensils, Droplets, Pill, Moon } from 'lucide-react';

const TodaySchedule = () => {
  const [items, setItems] = useState([
    { id: 1, time: '08:00 AM', title: 'Hydration Goal (Wake Up)', desc: 'Drink 400ml water', icon: Droplets, color: 'text-cyan-500 bg-cyan-500/10', done: true },
    { id: 2, time: '09:00 AM', title: 'Multivitamin Capsule', desc: 'Post-Breakfast supplement', icon: Pill, color: 'text-purple-500 bg-purple-500/10', done: true },
    { id: 3, time: '11:00 AM', title: 'Morning Walk Session', desc: 'Aim for 3,000 steps', icon: Flame, color: 'text-green-500 bg-green-500/10', done: false },
    { id: 4, time: '01:30 PM', title: 'Protein Rich Lunch', desc: 'Grilled chicken salad / Paneer bowl', icon: Utensils, color: 'text-blue-500 bg-blue-500/10', done: false },
    { id: 5, time: '06:00 PM', title: 'Evening Dumbbell Training', desc: 'Upper body push sets', icon: Flame, color: 'text-orange-500 bg-orange-500/10', done: false },
    { id: 6, time: '09:30 PM', title: 'Hydration Target Check', desc: 'Ensure water log > 2.2L', icon: Droplets, color: 'text-cyan-500 bg-cyan-500/10', done: false },
    { id: 7, time: '10:30 PM', title: 'Bedtime Window Reminder', desc: 'No screens, practice deep breathing', icon: Moon, color: 'text-indigo-500 bg-indigo-500/10', done: false }
  ]);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Today's Schedule</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Timely logging reminders & alerts</p>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-gray-100 dark:border-gray-700 ml-3 pl-6 space-y-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                
                {/* Timeline Dot Indicator */}
                <button 
                  onClick={() => toggleItem(item.id)}
                  className="absolute -left-[35px] top-1 p-1 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform z-10"
                >
                  {item.done ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-accent-primary" />
                  )}
                </button>

                {/* Card Container */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  item.done 
                    ? 'bg-gray-50/50 dark:bg-gray-750/30 border-gray-100 dark:border-gray-800/50 opacity-60' 
                    : 'bg-white/50 dark:bg-gray-750/50 border-gray-100 dark:border-gray-700 hover:shadow-md'
                }`}>
                  <div className="flex gap-3.5 items-start">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        ⏱️ {item.time}
                      </span>
                      <p className={`text-sm font-bold text-gray-800 dark:text-gray-200 ${item.done ? 'line-through' : ''}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default TodaySchedule;
