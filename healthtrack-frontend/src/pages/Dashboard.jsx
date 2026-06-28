import { useState, useEffect } from 'react';
import api from '../services/api.js';
import EntryList from '../components/entries/EntryList.jsx';
import ProgressChart from '../components/charts/ProgressChart.jsx';
import ActivityHeatmap from '../components/charts/ActivityHeatmap.jsx';
import MapView from '../components/maps/MapView.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';

const Dashboard = () => {
  const [todayStats, setTodayStats] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [nearbyEntries, setNearbyEntries] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location: userLocation, getCurrentPosition } = useGeolocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyEntries(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, progressResponse, mapResponse, entriesResponse] = await Promise.all([
        api.get('/dashboard/today'),
        api.get('/dashboard/progress?metric=calories&from=2024-01-01&to=2024-12-31'),
        api.get('/dashboard/map?from=2024-01-01&to=2024-12-31'),
        api.get('/entries')
      ]);
      setTodayStats(statsResponse.data);
      setProgressData(progressResponse.data);
      setMapData(mapResponse.data);
      setEntries(entriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyEntries = async (lat, lng) => {
    try {
      const response = await api.get(`/entries/nearby?lat=${lat}&lng=${lng}&radiusMeters=5000`);
      setNearbyEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch nearby entries:', error);
    }
  };

  const handleGetLocation = () => {
    getCurrentPosition();
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gradient">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg transition-all duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Welcome back! Here's your health overview</p>
        </div>

        {todayStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div className="text-white/80 text-sm font-medium">Today</div>
              </div>
              <h3 className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Calories Consumed</h3>
              <p className="text-5xl font-bold mb-1">{todayStats.caloriesConsumed}</p>
              <p className="text-white/70 text-sm">kcal</p>
            </div>

            <div className="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="text-3xl">🔥</span>
                </div>
                <div className="text-white/80 text-sm font-medium">Today</div>
              </div>
              <h3 className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Calories Burned</h3>
              <p className="text-5xl font-bold mb-1">{todayStats.caloriesBurned}</p>
              <p className="text-white/70 text-sm">kcal</p>
            </div>

            <div className="stat-card bg-gradient-to-br from-purple-500 to-pink-600 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="text-3xl">⚖️</span>
                </div>
                <div className="text-white/80 text-sm font-medium">Today</div>
              </div>
              <h3 className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Net Calories</h3>
              <p className="text-5xl font-bold mb-1">{todayStats.netCalories}</p>
              <p className="text-white/70 text-sm">balance</p>
            </div>

            <div className="stat-card bg-gradient-to-br from-orange-500 to-red-600 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <span className="text-3xl">💪</span>
                </div>
                <div className="text-white/80 text-sm font-medium">Today</div>
              </div>
              <h3 className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Workouts</h3>
              <p className="text-5xl font-bold mb-1">{todayStats.workoutCount}</p>
              <p className="text-white/70 text-sm">sessions</p>
            </div>
          </div>
        )}

        {todayStats?.latestWeight && (
          <div className="bg-gradient-to-r from-accent-from via-accent-via to-accent-to p-1 rounded-2xl shadow-2xl animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    Latest Weight
                  </h3>
                  <p className="text-5xl font-extrabold text-gradient">
                    {todayStats.latestWeight} <span className="text-2xl text-gray-600 dark:text-gray-400">kg</span>
                  </p>
                </div>
                <div className="text-6xl opacity-20">📊</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {progressData && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-glow transition-all duration-300">
              <ProgressChart data={progressData.data} metric={progressData.metric} multiMetric={progressData.metric === 'calories'} />
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-glow transition-all duration-300">
            <ActivityHeatmap entries={entries} />
          </div>
        </div>

        {mapData && mapData.points && mapData.points.length > 0 && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <span className="text-2xl">🗺️</span>
              </div>
              <h2 className="text-3xl font-bold text-gradient">Activity Map</h2>
            </div>
            <div className="h-96 rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700">
              <MapView
                points={mapData.points}
                center={mapData.points[0]?.coordinates || [0, 0]}
                onMarkerClick={(point) => {
                  console.log('Marker clicked:', point);
                }}
              />
            </div>
          </div>
        )}

        {userLocation && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <span className="text-2xl">📍</span>
                </div>
                <h2 className="text-3xl font-bold text-gradient">Nearby Activities</h2>
              </div>
              <button
                onClick={handleGetLocation}
                className="btn-gradient text-sm"
              >
                🔄 Refresh
              </button>
            </div>
            {nearbyEntries.length > 0 ? (
              <div className="space-y-3">
                {nearbyEntries.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry._id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-blue-100 dark:border-gray-600"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          entry.type === 'workout' ? 'bg-red-100 dark:bg-red-900' :
                          entry.type === 'meal' ? 'bg-green-100 dark:bg-green-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          <span className="text-xl">
                            {entry.type === 'workout' ? '💪' : entry.type === 'meal' ? '🍽️' : '⚖️'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200 capitalize text-lg">{entry.type}</p>
                          {entry.placeName && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <span>📍</span> {entry.placeName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-float">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">No nearby activities found. Try refreshing your location.</p>
              </div>
            )}
          </div>
        )}

        {!userLocation && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-float">🌍</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Nearby Activities</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Enable location to see activities near you and discover your fitness community!</p>
            <button
              onClick={handleGetLocation}
              className="btn-gradient text-lg px-8 py-4"
            >
              🌐 Enable Location
            </button>
          </div>
        )}

        <div className="animate-slide-up">
          <EntryList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
