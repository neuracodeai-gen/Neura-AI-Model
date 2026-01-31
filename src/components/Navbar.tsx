import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface flex items-center justify-between px-6 transition-colors duration-300">
      <div className="font-semibold text-lg text-gray-800 dark:text-white">
        {user.isAuthenticated ? `Welcome, ${user.username}` : 'Welcome Guest'}
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {user.isAuthenticated && (
          <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
