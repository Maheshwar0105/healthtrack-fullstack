import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Check } from 'lucide-react';

const MoodTracker = ({ onLogMood, currentMood }) => {
  const [selected, setSelected] = useState(currentMood || 8);
  const [saved, setSaved] = useState(false);

  const moods = [
    { label: 'Energetic', emoji: '😆', score: 10, color: 'hover:bg-green-500/10 border-green-500/20' },
    { label: 'Happy', emoji: '😊', score: 8, color: 'hover:bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Tired', emoji: '😐', score: 6, color: 'hover:bg-amber-500/10 border-amber-500/20' },
    { label: 'Stressed', emoji: '😰', score: 4, color: 'hover:bg-orange-500/10 border-orange-500/20' },
    { label: 'Sad', emoji: '😭', score: 2, color: 'hover:bg-red-500/10 border-red-500/20' }
  ];

  const handleSelect = (score) => {
    setSelected(score);
    setSaved(true);
    if (onLogMood) onLogMood(score);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl h-full animate-fade-in flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Mood Tracker</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Log how you feel to discover health patterns</p>
            </div>
          </div>
        </div>

        {/* Emoji Selector Grid */}
        <div className="grid grid-cols-5 gap-3 my-6">
          {moods.map((m) => (
            <motion.button
              key={m.score}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(m.score)}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 relative ${
                selected === m.score
                  ? 'bg-theme-gradient text-white border-transparent shadow-lg scale-105'
                  : 'bg-gray-50/50 dark:bg-gray-750/30 border-gray-100 dark:border-gray-700 hover:shadow-md ' + m.color
              }`}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className={`text-[9px] font-black uppercase tracking-wider ${
                selected === m.score ? 'text-white' : 'text-gray-400 dark:text-gray-500'
              }`}>{m.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analytics Info Status */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center text-xs font-bold text-gray-500">
        <span>Logged mood today:</span>
        <span className="text-gray-800 dark:text-gray-200 flex items-center gap-1">
          {saved ? (
            <span className="text-green-500 flex items-center gap-1 animate-pulse">
              <Check className="w-4 h-4" /> Saved!
            </span>
          ) : (
            `${selected} / 10 Score`
          )}
        </span>
      </div>
    </div>
  );
};

export default MoodTracker;
