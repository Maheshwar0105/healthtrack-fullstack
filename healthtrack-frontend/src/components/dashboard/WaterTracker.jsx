import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, RefreshCw } from 'lucide-react';

const WaterTracker = ({ currentIntake = 1200, targetIntake = 2500, onLogWater }) => {
  const percent = Math.min((currentIntake / targetIntake) * 100, 100);

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between items-center text-center">
      <div className="w-full">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 mb-6 text-left">
          <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Water Tracker</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track and log your daily hydration target</p>
          </div>
        </div>

        {/* Animated Bottle Grid */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-28 h-56 border-4 border-gray-300 dark:border-gray-600 rounded-b-3xl rounded-t-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden shadow-inner flex items-end">
            
            {/* Bottle Neck Cap cap */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-400 dark:bg-gray-500 rounded-t-sm" />
            
            {/* Water content with wave animation */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${percent}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="w-full bg-gradient-to-t from-blue-600/80 to-cyan-400/80 relative"
            >
              {/* Wave effect overlay */}
              <div className="absolute top-0 left-0 w-[200%] h-4 bg-cyan-300/30 -translate-y-2 rounded-full animate-pulse-slow" />
            </motion.div>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-gray-800 dark:text-gray-100 bg-white/40 dark:bg-gray-800/40 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                {percent.toFixed(0)}%
              </span>
            </div>
          </div>

          <p className="text-2xl font-black text-gray-800 dark:text-gray-100 mt-4">
            {currentIntake} <span className="text-sm font-bold text-gray-500">/ {targetIntake} ml</span>
          </p>
        </div>
      </div>

      {/* Log Buttons */}
      <div className="flex gap-3 w-full mt-4">
        <button
          onClick={() => onLogWater(250)}
          className="flex-1 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 rounded-2xl border border-cyan-500/20 font-black text-xs flex items-center justify-center gap-1.5 transition-colors transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> +250 ml
        </button>
        <button
          onClick={() => onLogWater(500)}
          className="flex-1 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-2xl border border-blue-500/20 font-black text-xs flex items-center justify-center gap-1.5 transition-colors transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> +500 ml
        </button>
        <button
          onClick={() => onLogWater(-currentIntake)}
          className="p-3 bg-gray-50 dark:bg-gray-750 text-gray-400 dark:text-gray-500 hover:text-red-500 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors"
          title="Reset Log"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
