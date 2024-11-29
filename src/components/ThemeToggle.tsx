import { useTheme } from '@/components/ThemeProvider';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getActiveIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg p-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        {getActiveIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-1">
            <button
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center rounded-md px-2 py-2 text-sm
                ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                hover:bg-gray-100 dark:hover:bg-gray-800
              `}
            >
              <SunIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Light
            </button>

            <button
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center rounded-md px-2 py-2 text-sm
                ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                hover:bg-gray-100 dark:hover:bg-gray-800
              `}
            >
              <MoonIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Dark
            </button>

            <button
              onClick={() => {
                setTheme('system');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center rounded-md px-2 py-2 text-sm
                ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                hover:bg-gray-100 dark:hover:bg-gray-800
              `}
            >
              <ComputerDesktopIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
