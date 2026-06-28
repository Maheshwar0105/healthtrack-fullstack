import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Wind, Sparkles, Quote, Award } from 'lucide-react';

const HeroSection = ({ userName, healthScore = 78, aiSummary }) => {
  const [greeting, setGreeting] = useState('Welcome back');
  const [timeStr, setTimeStr] = useState('');
  
  const quotes = [
    "Your body hears everything your mind says. Keep it positive.",
    "Health is not about the weight you lose, but the life you gain.",
    "The only bad workout is the one that didn't happen.",
    "It's a slow process, but quitting won't speed it up.",
    "Small daily improvements over time lead to stunning results."
  ];
  
  const [currentQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  // Determine score color
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-green-500 stroke-green-500';
    if (val >= 60) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  const getScoreBg = (val) => {
    if (val >= 80) return 'bg-green-500/10 text-green-500';
    if (val >= 60) return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-red-500/10 text-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Greeting & Date/Time & Weather */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-accent-primary" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-800 dark:text-gray-100">
                {greeting}, <span className="text-gradient">{userName} 👋</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} | {timeStr}
              </p>
            </div>
            
            {/* Weather Widget */}
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-750 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <Sun className="w-7 h-7 text-amber-500 animate-spin-slow" />
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">26°C</span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Sunny</p>
              </div>
            </div>
          </div>

          {/* AI Generated Daily Summary */}
          <div className="p-4 bg-gradient-to-r from-accent-from/5 to-accent-to/5 rounded-2xl border border-accent-primary/10 flex gap-3.5 items-start mt-6">
            <div className="p-2.5 bg-theme-gradient rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-accent-primary">AI Daily Co-Pilot Summary</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {aiSummary || "You logged 2 workouts yesterday and hit your sleep target. Hydration is currently 400ml behind schedule - consider logging 2 cups of water now to stay on track."}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="flex gap-3 items-center pt-6 border-t border-gray-100 dark:border-gray-700 mt-6 text-gray-500 dark:text-gray-400">
          <Quote className="w-5 h-5 text-accent-primary opacity-60 flex-shrink-0" />
          <p className="text-xs font-semibold italic">{currentQuote}</p>
        </div>
      </motion.div>

      {/* Health Score Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-1.5">
          <Award className="w-5 h-5 text-accent-primary" /> Overall Health Score
        </h3>

        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              className="stroke-gray-100 dark:stroke-gray-700"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="60"
              className={getScoreColor(healthScore)}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={376.8}
              initial={{ strokeDashoffset: 376.8 }}
              animate={{ strokeDashoffset: 376.8 - (376.8 * healthScore) / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-800 dark:text-gray-100">{healthScore}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Index</span>
          </div>
        </div>

        <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getScoreBg(healthScore)}`}>
          {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Optimal' : 'Needs Focus'}
        </div>
        
        <p className="text-xs text-gray-500 mt-3 font-semibold">Updated dynamically based on your logs</p>
      </motion.div>

    </div>
  );
};

export default HeroSection;
