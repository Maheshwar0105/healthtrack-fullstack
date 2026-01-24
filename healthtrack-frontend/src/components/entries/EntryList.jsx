import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import EntryForm from './EntryForm.jsx';

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEntries();
  }, [filter]);

  const fetchEntries = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get('/entries', { params });
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/entries/${id}`);
        fetchEntries();
      } catch (error) {
        alert('Failed to delete entry');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEntry(null);
    fetchEntries();
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'workout': return 'from-red-500 to-pink-600';
      case 'meal': return 'from-green-500 to-emerald-600';
      case 'weight': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'workout': return '💪';
      case 'meal': return '🍽️';
      case 'weight': return '⚖️';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-400 opacity-20"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gradient">Loading entries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-extrabold mb-2">
            <span className="text-gradient">Entries</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your health records</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all"
          >
            <option value="all">🔍 All</option>
            <option value="weight">⚖️ Weight</option>
            <option value="workout">💪 Workout</option>
            <option value="meal">🍽️ Meal</option>
          </select>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(true);
            }}
            className="btn-gradient"
          >
            ➕ Add Entry
          </button>
        </div>
      </div>

      {showForm && (
        <div className="animate-slide-up">
          <EntryForm
            entry={editingEntry}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
          />
        </div>
      )}

      {entries.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-8xl mb-6 animate-float">📋</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No entries yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start tracking your health journey by adding your first entry!</p>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(true);
            }}
            className="btn-gradient"
          >
            ➕ Create First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className={`bg-gradient-to-br ${getTypeColor(entry.type)} rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-3xl">
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl capitalize">{entry.type}</h3>
                    <p className="text-white/80 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-3xl font-extrabold mb-1">
                  {entry.type === 'weight' && `${entry.weightKg} kg`}
                  {entry.type === 'workout' && `${entry.durationMin} min`}
                  {entry.type === 'meal' && `${entry.caloriesConsumed} cal`}
                </p>
                {entry.type === 'workout' && (
                  <p className="text-white/90 text-sm">🔥 {entry.caloriesBurned} calories burned</p>
                )}
                {entry.type === 'workout' && entry.workoutType && (
                  <p className="text-white/80 text-sm mt-1">Type: {entry.workoutType}</p>
                )}
                {entry.type === 'meal' && entry.mealType && (
                  <p className="text-white/80 text-sm mt-1 capitalize">🍴 {entry.mealType}</p>
                )}
              </div>

              {entry.placeName && (
                <div className="mb-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <p className="text-sm flex items-center gap-1">
                    <span>📍</span> {entry.placeName}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/20">
                <button
                  onClick={() => handleEdit(entry)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="flex-1 bg-red-500/80 hover:bg-red-600 py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntryList;
