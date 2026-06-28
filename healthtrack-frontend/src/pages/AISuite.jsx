import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import Skeleton, { CardSkeleton } from '../components/common/Skeleton.jsx';

const AISuite = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Chat States
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Health Assistant. Ask me anything about diet, workouts, symptoms, or general wellness advice!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Diet Planner States
  const [dietPref, setDietPref] = useState('');
  const [dietGoal, setDietGoal] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [dietLoading, setDietLoading] = useState(false);

  // Workout Generator States
  const [workoutLevel, setWorkoutLevel] = useState('beginner');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [workoutLoading, setWorkoutLoading] = useState(false);

  // Weekly Report States
  const [weeklyReport, setWeeklyReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Actions
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { sender: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const historyContext = chatHistory.slice(-5).map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));
      
      const response = await api.post('/ai/chat', { 
        message: chatMessage,
        history: historyContext
      });

      setChatHistory(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error processing your query. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    setDietLoading(true);
    setDietPlan(null);
    try {
      const response = await api.post('/ai/diet', {
        preferences: dietPref,
        healthGoals: dietGoal
      });
      setDietPlan(response.data);
    } catch (error) {
      alert('Failed to generate diet plan. Please try again.');
    } finally {
      setDietLoading(false);
    }
  };

  const handleGenerateWorkout = async (e) => {
    e.preventDefault();
    setWorkoutLoading(true);
    setWorkoutPlan(null);
    try {
      const response = await api.post('/ai/workout', {
        fitnessLevel: workoutLevel,
        goals: workoutGoal
      });
      setWorkoutPlan(response.data);
    } catch (error) {
      alert('Failed to generate workout plan. Please try again.');
    } finally {
      setWorkoutLoading(false);
    }
  };

  const handleFetchReport = async () => {
    setReportLoading(true);
    setWeeklyReport('');
    try {
      const response = await api.get('/ai/report');
      setWeeklyReport(response.data.report);
    } catch (error) {
      alert('Failed to analyze weekly report.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg transition-all duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header Title */}
        <div className="animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-gradient">AI Health Suite</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Next-generation medical intelligence & planners</p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2.5 bg-white/40 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-white/20 backdrop-blur-xl max-w-2xl animate-fade-in">
          {[
            { id: 'chat', label: '💬 Health Assistant' },
            { id: 'diet', label: '🥗 Diet Planner' },
            { id: 'workout', label: '💪 Workout Generator' },
            { id: 'report', label: '📊 Weekly Report' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl font-bold transition-all duration-300 transform active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-theme-gradient text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Views */}
        <div className="animate-slide-up">
          
          {/* Tab 1: AI Chat Assistant */}
          {activeTab === 'chat' && (
            <div className="bg-white/75 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col h-[650px] relative overflow-hidden">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-theme-gradient rounded-2xl text-white text-3xl">🤖</div>
                <div>
                  <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">AI Medical Assistant</h3>
                  <p className="text-sm text-green-500 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online & Ready
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2">
                {chatHistory.map((h, i) => (
                  <div
                    key={i}
                    className={`flex ${h.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl shadow-md text-sm leading-relaxed whitespace-pre-line ${
                        h.sender === 'user'
                          ? 'bg-theme-gradient text-white rounded-tr-none'
                          : 'bg-gray-100 dark:bg-gray-750 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/50 dark:border-gray-700/50'
                      }`}
                    >
                      {h.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-bounce"></span>
                      <span className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-bounce delay-100"></span>
                      <span className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about symptoms, meal items, exercises, or habits..."
                  className="flex-1 px-5 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 dark:bg-gray-750 dark:text-gray-200 font-medium shadow-inner"
                  style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="btn-gradient px-6 py-3.5 rounded-2xl font-black disabled:opacity-50 flex items-center justify-center"
                >
                  🚀 Send
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: AI Diet Planner */}
          {activeTab === 'diet' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Input */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl h-fit">
                <h3 className="text-2xl font-black text-gradient mb-6">Setup Preferences</h3>
                <form onSubmit={handleGenerateDiet} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      🥗 Dietary Preference
                    </label>
                    <input
                      type="text"
                      value={dietPref}
                      onChange={(e) => setDietPref(e.target.value)}
                      placeholder="e.g. Vegetarian, Keto, High Protein, None"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 dark:bg-gray-750 dark:text-gray-200 font-medium"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      🎯 Health Goals
                    </label>
                    <input
                      type="text"
                      value={dietGoal}
                      onChange={(e) => setDietGoal(e.target.value)}
                      placeholder="e.g. Weight Loss, Muscle Gain, Improve Stamina"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 dark:bg-gray-750 dark:text-gray-200 font-medium"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={dietLoading}
                    className="w-full btn-gradient py-4 text-lg font-black disabled:opacity-50"
                  >
                    {dietLoading ? '⏳ Generating Plan...' : '🥗 Generate Diet Plan'}
                  </button>
                </form>
              </div>

              {/* Diet Outputs */}
              <div className="lg:col-span-2 space-y-6">
                {dietLoading && <CardSkeleton />}
                
                {dietPlan && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <h3 className="text-3xl font-black text-gradient">Your Customized Diet Plan</h3>
                        <p className="text-gray-500 mt-1">Generated by HealthTrack AI</p>
                      </div>
                      <div className="bg-white/40 dark:bg-gray-750/40 border px-5 py-3 rounded-2xl text-center" style={{ borderColor: 'var(--theme-primary)' }}>
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--theme-primary)' }}>Daily Calories</span>
                        <p className="text-3xl font-black mt-0.5" style={{ color: 'var(--theme-primary)' }}>{dietPlan.dailyCaloriesTarget} kcal</p>
                      </div>
                    </div>

                    {/* Macros Grid */}
                    <div>
                      <h4 className="font-extrabold text-xl mb-3 flex items-center gap-2">📊 Macro Nutrient Split</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(dietPlan.macroSplit).map(([key, val]) => (
                          <div key={key} className="bg-gray-50 dark:bg-gray-750 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 text-center">
                            <span className="text-xs font-bold text-gray-500 capitalize">{key}</span>
                            <p className="text-2xl font-black text-gray-800 dark:text-gray-100 mt-1">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meals List */}
                    <div>
                      <h4 className="font-extrabold text-xl mb-4 flex items-center gap-2">🍽️ Meals & Snacks</h4>
                      <div className="space-y-4">
                        {dietPlan.meals.map((meal, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-3xl p-2 bg-accent-primary/10 rounded-xl text-accent-primary flex items-center justify-center h-fit">
                              {meal.name.toLowerCase().includes('breakfast') ? '🌅' : meal.name.toLowerCase().includes('lunch') ? '☀️' : meal.name.toLowerCase().includes('snack') ? '🍎' : '🌙'}
                            </div>
                            <div className="flex-1 space-y-2">
                              <span className="font-black text-lg text-gray-800 dark:text-gray-200">{meal.name}</span>
                              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                {meal.options.map((opt, i) => <li key={i}>{opt}</li>)}
                              </ul>
                              {meal.waterMl && (
                                <p className="text-xs text-blue-500 font-bold flex items-center gap-1 mt-1">
                                  💧 Recommended water with meal: {meal.waterMl} ml
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Health Tips */}
                    {dietPlan.tips && (
                      <div className="p-5 bg-white/40 dark:bg-gray-750/40 rounded-2xl border" style={{ borderColor: 'var(--theme-primary)' }}>
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">💡 Healthy Tips</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                          {dietPlan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!dietLoading && !dietPlan && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-7xl mb-4 animate-float">🥗</div>
                    <h4 className="text-2xl font-bold mb-2">No Plan Generated</h4>
                    <p className="text-gray-500 max-w-sm">Define your preference and goals to generate your customized diet plan using AI.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: AI Workout Generator */}
          {activeTab === 'workout' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Input */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl h-fit">
                <h3 className="text-2xl font-black text-gradient mb-6">Setup Training</h3>
                <form onSubmit={handleGenerateWorkout} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      🏋️ Fitness Level
                    </label>
                    <select
                      value={workoutLevel}
                      onChange={(e) => setWorkoutLevel(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 dark:bg-gray-750 dark:text-gray-250 font-medium"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    >
                      <option value="beginner">Beginner (1-2 workouts/week)</option>
                      <option value="intermediate">Intermediate (3-4 workouts/week)</option>
                      <option value="advanced">Advanced (5+ workouts/week)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      🎯 Targets & Focus
                    </label>
                    <input
                      type="text"
                      value={workoutGoal}
                      onChange={(e) => setWorkoutGoal(e.target.value)}
                      placeholder="e.g. Lose fat, Strength, Cardio stamina"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 dark:bg-gray-750 dark:text-gray-250 font-medium"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={workoutLoading}
                    className="w-full btn-gradient py-4 text-lg font-black disabled:opacity-50"
                  >
                    {workoutLoading ? '⏳ Generating Routine...' : '💪 Generate Workout Plan'}
                  </button>
                </form>
              </div>

              {/* Workout Outputs */}
              <div className="lg:col-span-2 space-y-6">
                {workoutLoading && <CardSkeleton />}
                
                {workoutPlan && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <h3 className="text-3xl font-black text-gradient">Your Workout Routine</h3>
                        <p className="text-gray-500 mt-1">Generated by HealthTrack AI</p>
                      </div>
                      <div className="bg-white/40 dark:bg-gray-750/40 border px-5 py-3 rounded-2xl text-center" style={{ borderColor: 'var(--theme-primary)' }}>
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--theme-primary)' }}>Workouts</span>
                        <p className="text-3xl font-black mt-0.5" style={{ color: 'var(--theme-primary)' }}>{workoutPlan.weeklyFrequency} / week</p>
                      </div>
                    </div>

                    {/* Daily routines */}
                    <div>
                      <h4 className="font-extrabold text-xl mb-4 flex items-center gap-2">📅 Schedule</h4>
                      <div className="space-y-4">
                        {workoutPlan.routine.map((rout, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-3xl p-2 bg-accent-primary/10 rounded-xl text-accent-primary flex items-center justify-center h-fit">
                              🏋️
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-black text-lg text-gray-800 dark:text-gray-200">{rout.day}</span>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-accent-primary/20 text-accent-primary rounded-lg">{rout.durationMin} mins</span>
                              </div>
                              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                {rout.exercises.map((ex, i) => <li key={i}>{ex}</li>)}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Workout Tips */}
                    {workoutPlan.tips && (
                      <div className="p-5 bg-white/40 dark:bg-gray-750/40 rounded-2xl border" style={{ borderColor: 'var(--theme-primary)' }}>
                        <h4 className="font-black text-lg mb-2 flex items-center gap-2">💡 Workout Advice</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                          {workoutPlan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!workoutLoading && !workoutPlan && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-7xl mb-4 animate-float">💪</div>
                    <h4 className="text-2xl font-bold mb-2">No Routine Generated</h4>
                    <p className="text-gray-500 max-w-sm">Configure your training levels to generate your weekly workout guides using AI.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: AI Weekly Report */}
          {activeTab === 'report' && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-gradient-to-br from-accent-from to-accent-to rounded-2xl text-white text-3xl">📊</div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">Weekly Health Report</h3>
                    <p className="text-sm text-gray-500">AI analysis of your logs (calories, workouts, weights)</p>
                  </div>
                </div>
                <button
                  onClick={handleFetchReport}
                  disabled={reportLoading}
                  className="btn-gradient text-lg px-6 py-3 rounded-2xl font-black disabled:opacity-50"
                >
                  {reportLoading ? '⏳ Analyzing...' : '📊 Analyze Health Progress'}
                </button>
              </div>

              {reportLoading && <CardSkeleton />}

              {weeklyReport && (
                <div className="p-6 bg-gray-50 dark:bg-gray-750 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl markdown-container">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-sm leading-relaxed">
                    {weeklyReport}
                  </p>
                </div>
              )}

              {!reportLoading && !weeklyReport && (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-7xl mb-4 animate-float">📊</div>
                  <h4 className="text-2xl font-bold mb-2">No Analysis Done Yet</h4>
                  <p className="text-gray-500 max-w-sm">Click "Analyze Health Progress" to query past 7 days logs and receive structured feedback.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AISuite;
