import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Utensils, Droplet, Dumbbell, Heart, Scale, 
  Smile, Activity, Moon, Compass 
} from 'lucide-react';

const HealthCards = ({ stats = {} }) => {
  
  // Computed values
  const weight = stats.latestWeight || 70;
  const height = stats.heightCm || 170;
  const bmi = height > 0 ? (weight / ((height / 100) * (height / 100))).toFixed(1) : 22.5;

  const cardConfig = [
    {
      id: 'calories_consumed',
      title: 'Calories Consumed',
      value: stats.caloriesConsumed || 0,
      unit: 'kcal',
      target: 2300,
      icon: Utensils,
      bg: 'from-blue-500 to-indigo-600',
      text: 'text-blue-500',
      yesterday: '1,920 kcal yesterday',
      trend: '+12% vs yesterday',
      isUp: true
    },
    {
      id: 'calories_burned',
      title: 'Calories Burned',
      value: stats.caloriesBurned || 0,
      unit: 'kcal',
      target: 600,
      icon: Flame,
      bg: 'from-orange-500 to-red-600',
      text: 'text-orange-500',
      yesterday: '480 kcal yesterday',
      trend: '+25% vs yesterday',
      isUp: true
    },
    {
      id: 'water_intake',
      title: 'Water Intake',
      value: stats.waterIntake || 1200,
      unit: 'ml',
      target: 2500,
      icon: Droplet,
      bg: 'from-cyan-400 to-blue-500',
      text: 'text-cyan-500',
      yesterday: '2,200 ml yesterday',
      trend: '-15% vs yesterday',
      isUp: false
    },
    {
      id: 'steps',
      title: 'Steps',
      value: stats.steps || 7234,
      unit: 'steps',
      target: 10000,
      icon: Compass,
      bg: 'from-emerald-400 to-green-600',
      text: 'text-emerald-500',
      yesterday: '6,400 steps yesterday',
      trend: '+14% vs yesterday',
      isUp: true
    },
    {
      id: 'workout',
      title: 'Workout Minutes',
      value: stats.workoutDuration || stats.workoutCount * 30 || 45,
      unit: 'mins',
      target: 60,
      icon: Dumbbell,
      bg: 'from-rose-500 to-pink-600',
      text: 'text-rose-500',
      yesterday: '30 mins yesterday',
      trend: '+50% vs yesterday',
      isUp: true
    },
    {
      id: 'sleep',
      title: 'Sleep Duration',
      value: stats.sleepDuration || 7.2,
      unit: 'hrs',
      target: 8.0,
      icon: Moon,
      bg: 'from-indigo-500 to-purple-600',
      text: 'text-indigo-500',
      yesterday: '6.5 hrs yesterday',
      trend: '+10.8% vs yesterday',
      isUp: true
    },
    {
      id: 'heart_rate',
      title: 'Heart Rate',
      value: stats.heartRate || 72,
      unit: 'bpm',
      target: 100, // resting indicator
      icon: Heart,
      bg: 'from-red-500 to-rose-600',
      text: 'text-red-500',
      yesterday: '74 bpm resting yesterday',
      trend: '-2.7% vs yesterday',
      isUp: false // Lower resting HR is good
    },
    {
      id: 'weight',
      title: 'Weight',
      value: weight,
      unit: 'kg',
      target: stats.weightGoal || 75,
      icon: Scale,
      bg: 'from-purple-500 to-pink-500',
      text: 'text-purple-500',
      yesterday: '70.2 kg yesterday',
      trend: '-0.3 kg vs yesterday',
      isUp: false // Weight loss target assumed
    },
    {
      id: 'bmi',
      title: 'Body Mass Index (BMI)',
      value: bmi,
      unit: 'index',
      target: 25, // Upper limit healthy
      icon: Activity,
      bg: 'from-teal-400 to-emerald-500',
      text: 'text-teal-500',
      yesterday: 'Normal (18.5 - 24.9)',
      trend: 'Healthy range',
      isUp: true
    },
    {
      id: 'mood',
      title: 'Daily Mood',
      value: stats.moodScore || 8,
      unit: '/10',
      target: 10,
      icon: Smile,
      bg: 'from-fuchsia-500 to-purple-600',
      text: 'text-fuchsia-500',
      yesterday: '7/10 yesterday',
      trend: '+14.2% vs yesterday',
      isUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 animate-slide-up">
      {cardConfig.map((card, i) => {
        const Icon = card.icon;
        const progress = Math.min((card.value / card.target) * 100, 100);

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-5 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {card.title}
                </span>
                <p className="text-3xl font-black text-gray-800 dark:text-gray-100 flex items-baseline gap-1 mt-1">
                  {card.value}
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{card.unit}</span>
                </p>
              </div>

              {/* Icon Container with gradient hover */}
              <div className={`p-3 bg-gradient-to-br ${card.bg} text-white rounded-2xl shadow-md transform group-hover:rotate-12 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Circular or linear progress */}
            <div className="mt-5 space-y-2">
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-750 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${card.bg} rounded-full`}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black tracking-wider text-gray-400 dark:text-gray-500">
                <span>{progress.toFixed(0)}% Done</span>
                <span>Target: {card.target}</span>
              </div>
            </div>

            {/* Comparison details */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500 dark:text-gray-400 truncate max-w-[65%]">{card.yesterday}</span>
              <span className={`${card.isUp ? 'text-green-500' : 'text-red-400'} flex-shrink-0`}>
                {card.trend}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HealthCards;
