import { useState, useEffect } from 'react';
import api from '../services/api.js';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalType: 'targetWeight',
    value: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
        dueDate: formData.dueDate
      };

      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, submitData);
      } else {
        await api.post('/goals', submitData);
      }

      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        goalType: 'targetWeight',
        value: '',
        dueDate: ''
      });
      fetchGoals();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      goalType: goal.goalType,
      value: goal.value.toString(),
      dueDate: new Date(goal.dueDate).toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        alert('Failed to delete goal');
      }
    }
  };

  const toggleAchieved = async (goal) => {
    try {
      await api.put(`/goals/${goal._id}`, {
        achieved: !goal.achieved
      });
      fetchGoals();
    } catch (error) {
      alert('Failed to update goal');
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
          <p className="mt-6 text-lg font-semibold text-gradient">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-gradient">Goals</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Set and achieve your health milestones</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditingGoal(null);
              setFormData({
                goalType: 'targetWeight',
                value: '',
                dueDate: ''
              });
              setShowForm(true);
            }}
            className="btn-gradient text-lg"
          >
            🎯 Add New Goal
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-slide-up">
            <h2 className="text-3xl font-bold text-gradient mb-6">
              {editingGoal ? '✏️ Edit Goal' : '✨ Create New Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Goal Type
                </label>
                <select
                  name="goalType"
                  value={formData.goalType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                >
                  <option value="targetWeight">⚖️ Target Weight</option>
                  <option value="weeklyWorkouts">💪 Weekly Workouts</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  {formData.goalType === 'targetWeight' ? '🎯 Target Weight (kg)' : '💪 Number of Workouts'}
                </label>
                <input
                  type="number"
                  step={formData.goalType === 'targetWeight' ? '0.1' : '1'}
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  📅 Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 font-medium shadow-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 btn-gradient"
                >
                  {editingGoal ? '💾 Update Goal' : '✨ Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 text-center border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="text-8xl mb-6 animate-float">🎯</div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">No goals yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Start your journey by setting your first health goal!</p>
            <button
              onClick={() => {
                setEditingGoal(null);
                setFormData({
                  goalType: 'targetWeight',
                  value: '',
                  dueDate: ''
                });
                setShowForm(true);
              }}
              className="btn-gradient text-lg px-8 py-4"
            >
              🎯 Create First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <div
                key={goal._id}
                className={`bg-gradient-to-br ${
                  goal.achieved 
                    ? 'from-green-500 to-emerald-600' 
                    : goal.goalType === 'targetWeight'
                    ? 'from-blue-500 to-cyan-600'
                    : 'from-orange-500 to-red-600'
                } rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in relative overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {goal.achieved && (
                  <div className="absolute top-4 right-4 text-4xl animate-bounce-slow">🎉</div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-3xl">
                      {goal.goalType === 'targetWeight' ? '⚖️' : '💪'}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl capitalize">
                        {goal.goalType === 'targetWeight' ? 'Target Weight' : 'Weekly Workouts'}
                      </h3>
                      <p className="text-white/80 text-sm">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm ${
                    goal.achieved
                      ? 'bg-yellow-400/30 text-yellow-100'
                      : 'bg-white/20 text-white'
                  }`}>
                    {goal.achieved ? '✅ Achieved' : '⏳ In Progress'}
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-5xl font-extrabold mb-2">
                    {goal.goalType === 'targetWeight'
                      ? `${goal.value} kg`
                      : `${goal.value} workouts`}
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        goal.achieved ? 'bg-yellow-300' : 'bg-white/40'
                      }`}
                      style={{ width: goal.achieved ? '100%' : '60%' }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/20">
                  <button
                    onClick={() => toggleAchieved(goal)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm backdrop-blur-sm ${
                      goal.achieved
                        ? 'bg-yellow-400/30 hover:bg-yellow-400/40'
                        : 'bg-green-500/80 hover:bg-green-600'
                    }`}
                  >
                    {goal.achieved ? '↩️ Mark In Progress' : '✅ Mark Achieved'}
                  </button>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="flex-1 bg-red-500/80 hover:bg-red-600 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
