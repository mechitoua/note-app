import { Moon, Sun } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
      <span className="text-gray-700 dark:text-gray-300">
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>
    </div>
  );
});
