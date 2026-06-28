import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Logo from '../common/Logo.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    activityLevel: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined
      };
      await register(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative flex items-center justify-center bg-slate-950 transition-colors duration-200 overflow-hidden py-12 px-4">
      {/* Background Stretched Image & Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 mix-blend-luminosity scale-105" 
        style={{ backgroundImage: "url('/health_login_bg.png')" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-purple-950/40 z-0" />

      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 md:w-96 md:h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-72 h-72 md:w-96 md:h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 md:w-96 md:h-96 bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Glassmorphic Registration Card */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/60 dark:bg-slate-950/65 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10 transition-all duration-300 hover:shadow-glow/20">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <Logo className="h-11 w-11 bg-white/5 p-2 rounded-xl border border-white/10 shadow-inner" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">HealthTrack</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-slate-400 mt-1.5 text-sm text-center">Fill in your details to establish a health profile</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/60 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Account Details */}
            <div className="sm:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            {/* Physical Profile Metrics */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Age
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all"
                >
                  <option value="" className="bg-slate-900 text-white">Select Gender</option>
                  <option value="male" className="bg-slate-900 text-white">Male</option>
                  <option value="female" className="bg-slate-900 text-white">Female</option>
                  <option value="other" className="bg-slate-900 text-white">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Height (cm)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  placeholder="e.g. 175"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Weight (kg)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <input
                  type="number"
                  step="0.1"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  placeholder="e.g. 70.5"
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                Activity Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all"
                >
                  <option value="" className="bg-slate-900 text-white">Select Activity Level</option>
                  <option value="sedentary" className="bg-slate-900 text-white">Sedentary (little to no exercise)</option>
                  <option value="lightly_active" className="bg-slate-900 text-white">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active" className="bg-slate-900 text-white">Moderately Active (3-5 days/week)</option>
                  <option value="very_active" className="bg-slate-900 text-white">Very Active (6-7 days/week)</option>
                  <option value="extra_active" className="bg-slate-900 text-white">Extra Active (very active & physical job)</option>
                </select>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
