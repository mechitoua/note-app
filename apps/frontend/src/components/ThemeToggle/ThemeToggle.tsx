import { Moon, Sun } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {theme === 'dark' ? 'Dark' : 'Light'} Mode
      </span>
      {theme === 'dark' ? (
        <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
      )}
    </button>
  );
});
