import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Apple, Dumbbell, Moon, ShieldAlert, HeartPulse, RefreshCw 
} from 'lucide-react';

const AICopilot = ({ userName = 'Maheshwar' }) => {
  const [activeInsight, setActiveInsight] = useState('recommendations');

  const categories = [
    { id: 'recommendations', label: '🌟 All Insights', icon: Sparkles, color: 'text-purple-500' },
    { id: 'nutrition', label: '🥗 Nutrition', icon: Apple, color: 'text-green-500' },
    { id: 'workout', label: '🏋️ Workout', icon: Dumbbell, color: 'text-orange-500' },
    { id: 'sleep', label: '🌙 Sleep & Recovery', icon: Moon, color: 'text-blue-500' },
    { id: 'warnings', label: '⚠️ Warnings', icon: ShieldAlert, color: 'text-red-500' }
  ];

  const insightsData = {
    recommendations: [
      { text: "Your resting heart rate dropped slightly today to 71 bpm, indicating stable recovery.", icon: HeartPulse, color: 'bg-green-500/10 text-green-500' },
      { text: "Log your morning routine! Drinking 400ml of water now will boost metabolic recovery.", icon: Apple, color: 'bg-blue-500/10 text-blue-500' },
      { text: "We noticed you did cardiorespiratory workout 3 days ago. Today is ideal for strength sets.", icon: Dumbbell, color: 'bg-orange-500/10 text-orange-500' }
    ],
    nutrition: [
      { text: "Based on your calorie target (2300 kcal), aim to consume 75g of lean protein today.", icon: Apple, color: 'bg-green-500/10 text-green-500' },
      { text: "Adding fiber (avocado or mixed greens) to your dinner will improve nighttime sugar stabilization.", icon: Apple, color: 'bg-emerald-500/10 text-emerald-500' }
    ],
    workout: [
      { text: "Optimal workout time today: 6:00 PM based on your historical peak energy levels.", icon: Dumbbell, color: 'bg-orange-500/10 text-orange-500' },
      { text: "Focus on Core & Legs: Goblet squats, lunges, and plank sets are recommended.", icon: Dumbbell, color: 'bg-rose-500/10 text-rose-500' }
    ],
    sleep: [
      { text: "Aim to hit bed by 10:30 PM. Your last week's sleep latency shows lower deep sleep cycles when you log bedtimes past 11:00 PM.", icon: Moon, color: 'bg-indigo-500/10 text-indigo-500' },
      { text: "Avoid blue light exposure 45 minutes before sleep to optimize melatonin synthesis.", icon: Moon, color: 'bg-blue-500/10 text-blue-500' }
    ],
    warnings: [
      { text: "Your water intake is 40% lower than yesterday's average at this hour. Drink water now to avoid fatigue.", icon: ShieldAlert, color: 'bg-red-500/10 text-red-500' },
      { text: "High step counts yesterday without calf stretches might lead to morning stiffness. Rest well.", icon: ShieldAlert, color: 'bg-amber-500/10 text-amber-500' }
    ]
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col h-full animate-slide-up">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">AI Wellness Co-Pilot</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Personalized wellness recommendations & alerts</p>
          </div>
        </div>

        <button 
          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 transform active:scale-95 text-gray-400"
          title="Refresh Insights"
        >
          <RefreshCw className="w-5 h-5 hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-none border-b border-gray-100/50 dark:border-gray-700/50">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveInsight(cat.id)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-black transition-all duration-300 whitespace-nowrap ${
                activeInsight === cat.id
                  ? 'bg-theme-gradient text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Insights Content */}
      <div className="flex-1 mt-6 overflow-y-auto pr-2 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeInsight}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {insightsData[activeInsight]?.map((ins, index) => {
              const InsIcon = ins.icon;
              return (
                <div 
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50/50 dark:bg-gray-750/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 h-fit ${ins.color}`}>
                    <InsIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                      {ins.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
};

export default AICopilot;
