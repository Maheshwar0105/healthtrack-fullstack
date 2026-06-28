import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Logo from '../common/Logo.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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

      {/* Floating Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/60 dark:bg-slate-950/65 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10 transition-all duration-300 hover:shadow-glow/20">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <Logo className="h-11 w-11 bg-white/5 p-2 rounded-xl border border-white/10 shadow-inner" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">HealthTrack</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-1.5 text-sm text-center">Please enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/60 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 text-white transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
