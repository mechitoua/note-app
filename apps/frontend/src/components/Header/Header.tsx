import { Menu, Search, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  title: string;
  onLogoClick: () => void;
}

export const Header = ({ isSidebarOpen, setIsSidebarOpen, title, onLogoClick }: HeaderProps) => {
  return (
    <header className='h-14 border-b border-gray-200 bg-white dark:bg-gray-900 px-4 flex items-center'>
      {/* Left section */}
      <div className='w-64 flex items-center gap-3'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
        >
          <Menu className='w-5 h-5 text-gray-600 dark:text-gray-400' />
        </button>
        <button
          onClick={onLogoClick}
          className='text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
        >
          All Notes
        </button>
      </div>

      {/* Center section */}
      <div className='flex-1 flex justify-center items-center'>
        <div className='relative w-96'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-4 w-4 text-gray-400 dark:text-gray-600' />
          </div>
          <input
            type='text'
            placeholder='Search by title, content, or tags...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400'
          />
        </div>
      </div>

      {/* Right section */}
      <div className='w-64 flex items-center justify-end gap-3'>
        <ThemeToggle />
        <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'>
          <Settings className='w-5 h-5 text-gray-600 dark:text-gray-400' />
        </button>
        <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>{title}</div>
      </div>
    </header>
  );
};
