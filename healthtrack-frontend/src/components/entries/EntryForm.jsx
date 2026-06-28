import { useState, useEffect } from 'react';
import api, { reverseGeocode } from '../../services/api.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';

const EntryForm = ({ entry, onSuccess, onCancel }) => {
  const { location, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const [formData, setFormData] = useState({
    type: 'weight',
    weightKg: '',
    workoutType: '',
    durationMin: '',
    caloriesBurned: '',
    mealType: 'breakfast',
    caloriesConsumed: '',
    date: new Date().toISOString().split('T')[0],
    location: null,
    placeName: '',
    isPublic: false
  });
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        type: entry.type,
        weightKg: entry.weightKg || '',
        workoutType: entry.workoutType || '',
        durationMin: entry.durationMin || '',
        caloriesBurned: entry.caloriesBurned || '',
        mealType: entry.mealType || 'breakfast',
        caloriesConsumed: entry.caloriesConsumed || '',
        date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        location: entry.location?.coordinates ? {
          coordinates: entry.location.coordinates
        } : null,
        placeName: entry.placeName || '',
        isPublic: entry.isPublic || false
      });
    }
  }, [entry]);

  useEffect(() => {
    if (location) {
      handleLocationUpdate(location.lng, location.lat);
    }
  }, [location]);

  const handleLocationUpdate = async (lng, lat) => {
    setLocationError('');
    try {
      const placeName = await reverseGeocode(lng, lat);
      setFormData(prev => ({
        ...prev,
        location: {
          coordinates: [lng, lat]
        },
        placeName: placeName || ''
      }));
    } catch (error) {
      setLocationError('Failed to get location name');
      setFormData(prev => ({
        ...prev,
        location: {
          coordinates: [lng, lat]
        }
      }));
    }
  };

  const handleUseLocation = () => {
    setLocationError('');
    getCurrentPosition();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleManualLocation = (e) => {
    const { name, value } = e.target;
    if (name === 'placeName') {
      setFormData({
        ...formData,
        placeName: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        type: formData.type,
        date: formData.date,
        ...(formData.type === 'weight' && { weightKg: parseFloat(formData.weightKg) }),
        ...(formData.type === 'workout' && {
          workoutType: formData.workoutType,
          durationMin: parseInt(formData.durationMin),
          caloriesBurned: parseInt(formData.caloriesBurned)
        }),
        ...(formData.type === 'meal' && {
          mealType: formData.mealType,
          caloriesConsumed: parseInt(formData.caloriesConsumed)
        }),
        ...(formData.location && {
          location: {
            type: 'Point',
            coordinates: formData.location.coordinates
          }
        }),
        ...(formData.placeName && { placeName: formData.placeName }),
        isPublic: formData.isPublic
      };

      if (entry) {
        await api.put(`/entries/${entry._id}`, submitData);
      } else {
        await api.post('/entries', submitData);
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save entry');
    }
  };

  const getTypeGradient = (type) => {
    switch(type) {
      case 'weight': return 'from-blue-500 to-cyan-600';
      case 'workout': return 'from-red-500 to-pink-600';
      case 'meal': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getTypeGradient(formData.type)} p-1 rounded-2xl shadow-2xl animate-slide-up`}>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 bg-gradient-to-br ${getTypeGradient(formData.type)} rounded-xl text-white`}>
            <span className="text-3xl">
              {formData.type === 'weight' ? '⚖️' : formData.type === 'workout' ? '💪' : '🍽️'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gradient">
            {entry ? '✏️ Edit Entry' : '✨ Create New Entry'}
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
              <span>📝</span> Entry Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-accent-primary/30 dark:border-accent-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
            >
              <option value="weight" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">⚖️ Weight</option>
              <option value="workout" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">💪 Workout</option>
              <option value="meal" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">🍽️ Meal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
              <span>📅</span> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-accent-primary/30 dark:border-accent-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
            />
          </div>

          {formData.type === 'weight' && (
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
                required
                className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
              />
            </div>
          )}

          {formData.type === 'workout' && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>💪</span> Workout Type
                </label>
                <input
                  type="text"
                  name="workoutType"
                  value={formData.workoutType}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Running, Weightlifting"
                  className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>⏱️</span> Duration (min)
                  </label>
                  <input
                    type="number"
                    name="durationMin"
                    value={formData.durationMin}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <span>🔥</span> Calories Burned
                  </label>
                  <input
                    type="number"
                    name="caloriesBurned"
                    value={formData.caloriesBurned}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                  />
                </div>
              </div>
            </>
          )}

          {formData.type === 'meal' && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🍽️</span> Meal Type
                </label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                >
                  <option value="breakfast" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">🌅 Breakfast</option>
                  <option value="lunch" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">☀️ Lunch</option>
                  <option value="dinner" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">🌙 Dinner</option>
                  <option value="snack" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">🍎 Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🔥</span> Calories Consumed
                </label>
                <input
                  type="number"
                  name="caloriesConsumed"
                  value={formData.caloriesConsumed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                />
              </div>
            </>
          )}

          <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-blue-200 dark:border-blue-700">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-3 flex items-center gap-2">
              <span>📍</span> Location (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={geoLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 text-sm"
              >
                {geoLoading ? '⏳ Getting Location...' : '🌐 Use My Location'}
              </button>
            </div>
            {geoError && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-2 flex items-center gap-1">
                <span>⚠️</span> {geoError}
              </p>
            )}
            {locationError && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-2 flex items-center gap-1">
                <span>⚠️</span> {locationError}
              </p>
            )}
            {formData.placeName && (
              <div className="mb-3 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <p className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-lg">📍</span> {formData.placeName}
                </p>
              </div>
            )}
            <input
              type="text"
              name="placeName"
              value={formData.placeName}
              onChange={handleManualLocation}
              placeholder="Or enter location manually"
              className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
            />
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-5 h-5 rounded border-2 border-accent-primary focus:ring-2 focus:ring-accent-primary"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🌐</span> Make this entry public/shareable
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-gradient"
            >
              {entry ? '💾 Update Entry' : '✨ Create Entry'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
