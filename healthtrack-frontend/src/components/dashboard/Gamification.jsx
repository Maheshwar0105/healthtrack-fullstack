import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Zap, Trophy, ShieldAlert } from 'lucide-react';

const Gamification = () => {
  const currentStreak = 5;
  const currentLevel = 3;
  const currentXp = 320;
  const targetXp = 500;
  const xpPct = (currentXp / targetXp) * 100;

  const badges = [
    { name: 'Hydration Hero', icon: '💧', desc: 'Logged 2.5L+ water for 3 consecutive days' },
    { name: 'Calorie Tamer', icon: '🍽️', desc: 'Stuck to calorie goals for 5 days' },
    { name: 'Sprint Master', icon: '🏃', desc: 'Completed 3 running sessions' }
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Header Streak Indicator */}
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Gamification</h3>
          
          <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 text-orange-500">
            <Flame className="w-5 h-5 fill-orange-500/10 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-wider">{currentStreak} Day Streak</span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
              <span className="text-sm font-black text-gray-850 dark:text-gray-150">Level {currentLevel} Athlete</span>
            </div>
            <span className="text-xs font-bold text-gray-500">{currentXp} / {targetXp} XP</span>
          </div>
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-semibold">Earn {targetXp - currentXp} XP to reach Level {currentLevel + 1}</p>
        </div>

        {/* Active Challenge */}
        <div className="p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-theme-gradient text-white rounded-xl shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Active Challenge</span>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Weekend Warrior Steps</p>
              <p className="text-xs text-gray-500">Log 20,000 steps between Saturday & Sunday.</p>
              
              {/* Challenge progress bar */}
              <div className="pt-2">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }} />
                </div>
                <div className="flex justify-between text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                  <span>12,000 / 20,000 Steps</span>
                  <span>60% Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges shelf */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-3">
            Unlocked Achievements Shelf
          </span>
          <div className="flex gap-3">
            {badges.map((badge, idx) => (
              <div 
                key={idx} 
                className="group relative cursor-pointer"
                title={`${badge.name}: ${badge.desc}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-750 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-shadow duration-300 transform group-hover:scale-105">
                  {badge.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default Gamification;
