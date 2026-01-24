import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-2xl transition-all duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-extrabold hover:scale-110 transition-transform duration-300 flex items-center gap-2">
            <span className="text-3xl">🏥</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">HealthTrack</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                📊 Dashboard
              </Link>
              <Link to="/goals" className="hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                🎯 Goals
              </Link>
              <Link to="/profile" className="hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                👤 Profile
              </Link>
              <span className="text-yellow-200 dark:text-yellow-300 font-semibold px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                👋 {user.name}
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 text-2xl"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-white/30"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                Login
              </Link>
              <Link to="/register" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-white/30">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
