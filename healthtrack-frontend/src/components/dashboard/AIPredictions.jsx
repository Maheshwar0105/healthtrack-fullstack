import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Flame, Droplets, Target } from 'lucide-react';

const AIPredictions = () => {
  const forecasts = [
    {
      title: 'Weight Forecast',
      desc: 'Based on your deficit trends, you are projected to lose 1.2 kg by next week.',
      icon: TrendingDown,
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
      metric: '68.8 kg'
    },
    {
      title: 'Daily Calorie Limit',
      desc: 'Expected calorie intake adjustment recommendation based on workout density.',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      metric: '2,150 kcal'
    },
    {
      title: 'Hydration Target',
      desc: 'High workout density predictions suggest shifting water logs to 2.8L tomorrow.',
      icon: Droplets,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      metric: '2,800 ml'
    }
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">AI Predictions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">7-day health projections & forecasts</p>
          </div>
        </div>

        <div className="space-y-4">
          {forecasts.map((forecast, idx) => {
            const Icon = forecast.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ x: 3 }}
                className="flex gap-4 p-4 bg-gray-50/50 dark:bg-gray-750/30 border border-gray-100/50 dark:border-gray-700/50 rounded-2xl"
              >
                <div className={`p-3 rounded-xl border ${forecast.color} flex-shrink-0 h-fit`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-black text-gray-850 dark:text-gray-100">{forecast.title}</h4>
                    <span className="text-xs font-black text-accent-primary whitespace-nowrap">{forecast.metric}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{forecast.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default AIPredictions;
