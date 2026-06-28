import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Logo from './Logo.jsx';

const themes = [
  { name: 'purple', colorClass: 'bg-purple-500 hover:bg-purple-400 border-purple-300' },
  { name: 'blue', colorClass: 'bg-blue-500 hover:bg-blue-400 border-blue-300' },
  { name: 'green', colorClass: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300' },
  { name: 'orange', colorClass: 'bg-orange-500 hover:bg-orange-400 border-orange-300' },
  { name: 'rose', colorClass: 'bg-rose-500 hover:bg-rose-400 border-rose-300' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, themeColor, changeThemeColor } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-2xl transition-all duration-300 sticky top-0 z-50">
      <div className="w-full px-6 md:px-10">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-extrabold hover:scale-105 transition-transform duration-300 flex items-center gap-2.5">
            <Logo className="h-9 w-9 bg-white/10 p-1.5 rounded-xl backdrop-blur-sm shadow-inner" />
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
              <Link to="/ai" className="hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-white/20 backdrop-blur-sm">
                🤖 AI Suite
              </Link>
              <span className="text-yellow-200 dark:text-yellow-300 font-semibold px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                👋 {user.name}
              </span>
              
              {/* Theme Settings Group */}
              <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                {/* Accent selector */}
                <div className="flex items-center gap-1 bg-white/10 dark:bg-gray-800/40 p-1 rounded-xl border border-white/10">
                  {themes.map(t => (
                    <button
                      key={t.name}
                      onClick={() => changeThemeColor(t.name)}
                      className={`w-5 h-5 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none border ${t.colorClass} ${
                        themeColor === t.name 
                          ? 'ring-2 ring-white ring-offset-1 scale-110 shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={`Switch to ${t.name} theme`}
                    />
                  ))}
                </div>
                {/* Dark mode button */}
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 text-xl"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border border-white/30"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Theme Settings Group for Guests */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 dark:bg-gray-800/40 p-1 rounded-xl border border-white/10">
                  {themes.map(t => (
                    <button
                      key={t.name}
                      onClick={() => changeThemeColor(t.name)}
                      className={`w-5 h-5 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none border ${t.colorClass} ${
                        themeColor === t.name 
                          ? 'ring-2 ring-white ring-offset-1 scale-110 shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={`Switch to ${t.name} theme`}
                    />
                  ))}
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 text-xl"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

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
