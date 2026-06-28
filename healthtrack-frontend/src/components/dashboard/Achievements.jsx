import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, ShieldCheck, Heart } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: 'Centurion Runner',
      desc: 'Completed a single cardiorespiratory workout session of 60+ minutes.',
      icon: Award,
      color: 'from-amber-400 to-orange-500',
      badgeColor: 'text-amber-500 bg-amber-500/10',
      date: 'Earned 3 days ago'
    },
    {
      id: 2,
      title: 'Water Tamer',
      desc: 'Achieved the 2,500 ml daily hydration goal for 7 consecutive days.',
      icon: Star,
      color: 'from-cyan-400 to-blue-500',
      badgeColor: 'text-cyan-500 bg-cyan-500/10',
      date: 'Earned 1 week ago'
    },
    {
      id: 3,
      title: 'Heart rate Safe',
      desc: 'Resting heart rate logged in the healthy range (60-80 bpm) for 14 days.',
      icon: Heart,
      color: 'from-rose-400 to-red-500',
      badgeColor: 'text-rose-500 bg-rose-500/10',
      date: 'Earned 2 weeks ago'
    }
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
        <div className="p-3 bg-theme-gradient text-white rounded-2xl shadow-md">
          <TrophyIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Achievements Showcase</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Milestones unlocked along your healthy lifestyle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="p-5 bg-white/50 dark:bg-gray-750/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                <Icon className="w-24 h-24 text-accent-primary" />
              </div>

              <div className="space-y-3">
                <div className={`p-3 rounded-2xl w-fit ${ach.badgeColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-lg text-gray-800 dark:text-gray-200">{ach.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{ach.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100/50 dark:border-gray-700/50 flex justify-between items-center text-[10px] font-bold text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Unlocked
                </span>
                <span>{ach.date}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Simple helper inside file for trophy icon
const TrophyIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a6 6 0 0 0-6 6v3.5c0 1.63 1.25 2.97 2.83 3.14l.02.01c1.01.08 2.05.15 3.15.15s2.14-.07 3.15-.15l.02-.01C16.75 14.47 18 13.13 18 11.5V8a6 6 0 0 0-6-6z" />
  </svg>
);

export default Achievements;
