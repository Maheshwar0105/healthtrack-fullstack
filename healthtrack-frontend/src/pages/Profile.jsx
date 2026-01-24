import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import MapView from '../components/maps/MapView.jsx';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    activityLevel: '',
    locationSharingEnabled: true
  });
  const [lastLocation, setLastLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUser();
    fetchLastLocation();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        age: response.data.age || '',
        gender: response.data.gender || '',
        heightCm: response.data.heightCm || '',
        weightKg: response.data.weightKg || '',
        activityLevel: response.data.activityLevel || '',
        locationSharingEnabled: response.data.locationSharingEnabled !== false
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastLocation = async () => {
    try {
      const response = await api.get('/entries?type=workout');
      const entryWithLocation = response.data.find(e => e.location && e.location.coordinates);
      if (entryWithLocation) {
        setLastLocation({
          coordinates: entryWithLocation.location.coordinates,
          placeName: entryWithLocation.placeName,
          date: entryWithLocation.date,
          type: entryWithLocation.type
        });
      }
    } catch (error) {
      console.error('Failed to fetch last location:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined
      };
      const response = await api.put('/users/me', updateData);
      setUser(response.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gradient">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your personal information</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl shadow-lg ${
              message.includes('success')
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
            } animate-slide-up`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{message.includes('success') ? '✅' : '❌'}</span>
              <p className="font-semibold">{message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold text-gradient">Personal Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>📧</span> Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>👋</span> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>🎂</span> Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>⚧️</span> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  >
                    <option value="">Select</option>
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">🌈 Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>📏</span> Height (cm)
                  </label>
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>⚖️</span> Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🏃</span> Activity Level
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                >
                  <option value="">Select</option>
                  <option value="sedentary">🪑 Sedentary</option>
                  <option value="lightly_active">🚶 Lightly Active</option>
                  <option value="moderately_active">🏃 Moderately Active</option>
                  <option value="very_active">🏋️ Very Active</option>
                  <option value="extra_active">🔥 Extra Active</option>
                </select>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="locationSharingEnabled"
                    checked={formData.locationSharingEnabled}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span>📍</span> Enable location sharing
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-gradient text-lg py-4 disabled:opacity-50"
              >
                {saving ? '💾 Saving...' : '💾 Update Profile'}
              </button>
            </form>
          </div>

          {lastLocation && (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                  <span className="text-4xl">📍</span>
                </div>
                <h2 className="text-3xl font-bold text-gradient">Last Known Location</h2>
              </div>
              {lastLocation.placeName && (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                  <p className="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                    <span className="text-xl">📍</span> {lastLocation.placeName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {new Date(lastLocation.date).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="h-80 rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700">
                <MapView
                  points={[lastLocation]}
                  center={lastLocation.coordinates}
                  zoom={15}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
