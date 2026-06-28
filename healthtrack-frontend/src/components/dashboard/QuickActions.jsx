import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Camera, Activity, Droplets, Pill, Sparkles, AlertTriangle, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = ({ onLogWater, onLogMeal, onLogWorkout, onTriggerSOS }) => {
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);

  const startFoodScan = () => {
    setShowScanModal(true);
    setScanning(true);
    setScanResult('');
    setTimeout(() => {
      setScanning(false);
      setScanResult('Greek Yogurt Bowl with Honey & Walnuts (Est: 280 kcal, 15g Protein)');
    }, 2500);
  };

  const actionButtons = [
    { label: 'Add Meal', icon: Plus, bg: 'from-blue-500 to-indigo-600', onClick: onLogMeal },
    { label: 'Scan Food', icon: Camera, bg: 'from-green-500 to-emerald-600', onClick: startFoodScan },
    { label: 'Log Workout', icon: Activity, bg: 'from-orange-500 to-red-600', onClick: onLogWorkout },
    { label: 'Drink Water', icon: Droplets, bg: 'from-cyan-400 to-blue-500', onClick: () => onLogWater(250) },
    { label: 'Medicine', icon: Pill, bg: 'from-purple-500 to-indigo-500', onClick: () => alert('Medicine reminder logged!') },
    { label: 'Ask AI', icon: Sparkles, bg: 'from-fuchsia-500 to-purple-600', link: '/ai' },
    { label: 'Emergency SOS', icon: AlertTriangle, bg: 'from-red-600 to-rose-700', onClick: onTriggerSOS, important: true }
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-xl animate-fade-in">
      <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 mb-5">⚡ Quick Actions</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {actionButtons.map((btn, idx) => {
          const Icon = btn.icon;
          const content = (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.onClick}
              className={`w-full p-4 rounded-2xl text-white font-extrabold flex flex-col items-center justify-center gap-2.5 shadow-lg bg-gradient-to-br ${btn.bg} ${
                btn.important ? 'ring-4 ring-red-500/20' : ''
              }`}
            >
              <Icon className="w-6 h-6 animate-pulse-slow" />
              <span className="text-xs tracking-wider">{btn.label}</span>
            </motion.button>
          );

          if (btn.link) {
            return <Link to={btn.link} key={idx} className="w-full">{content}</Link>;
          }
          return content;
        })}
      </div>

      {/* AI Food Scanner Simulator Modal */}
      <AnimatePresence>
        {showScanModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 max-w-md w-full rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowScanModal(false)}
                className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <h4 className="text-2xl font-black text-gradient mb-6">AI Nutrition Scanner</h4>
              
              <div className="relative aspect-video bg-gray-900 rounded-2xl border-2 border-dashed border-accent-primary flex flex-col items-center justify-center text-white overflow-hidden">
                {scanning ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/20 to-transparent animate-pulse" />
                    {/* Scanning laser effect */}
                    <motion.div 
                      animate={{ y: [0, 150, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-1 bg-accent-primary shadow-glow shadow-accent-primary"
                    />
                    <Camera className="w-12 h-12 text-accent-primary animate-bounce mb-3" />
                    <p className="text-sm font-bold tracking-wide animate-pulse">Scanning plate ingredients...</p>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-4">
                    <div className="text-5xl">🥗</div>
                    <p className="text-sm font-bold text-green-400">Scan Complete!</p>
                    <p className="text-xs font-semibold text-gray-300 italic">{scanResult}</p>
                    <button
                      onClick={() => {
                        onLogMeal({ calories: 280, name: 'Greek Yogurt Bowl' });
                        setShowScanModal(false);
                      }}
                      className="btn-gradient px-4 py-2 text-xs rounded-xl font-bold mt-2"
                    >
                      Log Scanned Meal
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
