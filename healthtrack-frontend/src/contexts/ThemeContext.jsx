import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [themeColor, setThemeColor] = useState(() => {
    const saved = localStorage.getItem('themeColor');
    return saved || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    const themeClasses = ['theme-purple', 'theme-blue', 'theme-green', 'theme-orange', 'theme-rose'];
    themeClasses.forEach(cls => document.documentElement.classList.remove(cls));
    document.documentElement.classList.add(`theme-${themeColor}`);
  }, [themeColor]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const changeThemeColor = (color) => {
    setThemeColor(color);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, themeColor, changeThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

