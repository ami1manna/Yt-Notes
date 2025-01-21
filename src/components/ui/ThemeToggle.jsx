import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded mx-2.5"
    >
      {theme === 'light' ? '🌙  ' : '☀️ '}
    </button>
  );
};

export default ThemeToggle;