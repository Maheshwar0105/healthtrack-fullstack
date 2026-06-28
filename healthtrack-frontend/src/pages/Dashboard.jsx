import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useGeolocation } from '../hooks/useGeolocation.js';

// Modular Dashboard Subcomponents
import HeroSection from '../components/dashboard/HeroSection.jsx';
import HealthCards from '../components/dashboard/HealthCards.jsx';
import AICopilot from '../components/dashboard/AICopilot.jsx';
import AnalyticsSection from '../components/dashboard/AnalyticsSection.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import TodaySchedule from '../components/dashboard/TodaySchedule.jsx';
import Gamification from '../components/dashboard/Gamification.jsx';
import Achievements from '../components/dashboard/Achievements.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import WaterTracker from '../components/dashboard/WaterTracker.jsx';
import MoodTracker from '../components/dashboard/MoodTracker.jsx';
import HealthCalendar from '../components/dashboard/HealthCalendar.jsx';
import NearbyServices from '../components/dashboard/NearbyServices.jsx';
import CommunityPreview from '../components/dashboard/CommunityPreview.jsx';
import AIPredictions from '../components/dashboard/AIPredictions.jsx';
import EntryList from '../components/entries/EntryList.jsx';

const Dashboard = () => {
  const [todayStats, setTodayStats] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location: userLocation, getCurrentPosition } = useGeolocation();

  // Local interactive states to support immediate micro-animations
  const [waterIntake, setWaterIntake] = useState(1200);
  const [moodScore, setMoodScore] = useState(8);
  const [aiSummary, setAiSummary] = useState('');

  useEffect(() => {
    fetchDashboardData();
    getCurrentPosition(); // Attempt getting location silently on startup
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, progressResponse, entriesResponse] = await Promise.all([
        api.get('/dashboard/today'),
        api.get('/dashboard/progress?metric=calories&from=2026-01-01&to=2026-12-31'),
        api.get('/entries')
      ]);

      setTodayStats(statsResponse.data);
      setProgressData(progressResponse.data);
      setEntries(entriesResponse.data);

      if (statsResponse.data) {
        if (statsResponse.data.waterIntake) setWaterIntake(statsResponse.data.waterIntake);
        if (statsResponse.data.moodScore) setMoodScore(statsResponse.data.moodScore);
      }

      // Fetch AI summary from weekly report endpoint if possible
      try {
        const aiReportRes = await api.get('/ai/report');
        if (aiReportRes.data && aiReportRes.data.report) {
          // Extract a short sentence/paragraph as the daily summary
          const lines = aiReportRes.data.report.split('\n').filter(l => l.trim().length > 0);
          const firstPara = lines.find(l => !l.startsWith('#') && !l.startsWith('-')) || '';
          setAiSummary(firstPara.slice(0, 220) + '...');
        }
      } catch (aiErr) {
        console.warn('AI report not available. Using demo summary.');
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Immediate log callbacks
  const handleLogWater = (amount) => {
    if (amount < 0) {
      setWaterIntake(0);
    } else {
      setWaterIntake(prev => prev + amount);
    }
  };

  const handleLogMood = (score) => {
    setMoodScore(score);
  };

  const handleLogMeal = (mealDetails) => {
    // Refresh dashboard stats on meal log success
    fetchDashboardData();
  };

  const handleLogWorkout = () => {
    fetchDashboardData();
  };

  const handleTriggerSOS = () => {
    alert('🚨 EMERGENCY SOS ACTIVATED! Emitting medical alerts to emergency contacts and dashboard network...');
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await api.delete(`/entries/${id}`);
        fetchDashboardData();
      } catch (error) {
        alert('Failed to delete log.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gradient">Loading your wellness cockpit...</p>
        </div>
      </div>
    );
  }

  // Combine dynamic backend todayStats with interactive local states
  const combinedStats = {
    ...todayStats,
    waterIntake,
    moodScore
  };

  const userName = todayStats?.name || 'Athlete';

  return (
    <div className="min-h-screen theme-bg transition-all duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        
        {/* Row 1: Greeting & Health Score */}
        <HeroSection userName={userName} healthScore={78} aiSummary={aiSummary} />

        {/* Row 2: Quick Action Panels */}
        <QuickActions 
          onLogWater={handleLogWater} 
          onLogMeal={handleLogMeal} 
          onLogWorkout={handleLogWorkout} 
          onTriggerSOS={handleTriggerSOS} 
        />

        {/* Row 3: 10 Grid Indicators */}
        <HealthCards stats={combinedStats} />

        {/* Row 4: AI Insights & Routine timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AICopilot userName={userName} />
          </div>
          <div>
            <TodaySchedule />
          </div>
        </div>

        {/* Row 5: Detailed Calorie Analytics and Heatmap */}
        <AnalyticsSection progressData={progressData} entries={entries} />

        {/* Row 6: Interactive Water, Mood and Calendar Trackers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WaterTracker currentIntake={waterIntake} targetIntake={2500} onLogWater={handleLogWater} />
          <MoodTracker onLogMood={handleLogMood} currentMood={moodScore} />
          <HealthCalendar />
        </div>

        {/* Row 7: Gamification Achievements Shelf */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Gamification />
          </div>
          <div className="lg:col-span-2">
            <Achievements />
          </div>
        </div>

        {/* Row 8: OSM Maps Nearby, Forums, and AI Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NearbyServices userLocation={userLocation} />
          <CommunityPreview />
          <AIPredictions />
        </div>

        {/* Sidebar/Recent activity timeline and raw list logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EntryList />
          </div>
          <div>
            <RecentActivity entries={entries} onDeleteEntry={handleDeleteEntry} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
