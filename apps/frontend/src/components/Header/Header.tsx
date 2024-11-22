import { ThemeToggle } from '@/components/ThemeToggle';
import { useNoteStore } from '@/store/useNoteStore';
import { Menu, Search } from 'lucide-react';
import { useCallback, useRef } from 'react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  title: string;
  onLogoClick: () => void;
  isSearching?: boolean;
  totalResults?: number;
}

export const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  title,
  onLogoClick,
  isSearching,
  totalResults,
}: HeaderProps) => {
  const searchQuery = useNoteStore((state) => state.searchQuery);
  const setSearchQuery = useNoteStore((state) => state.setSearchQuery);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  return (
    <header className='h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 flex items-center'>
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
          {title}
        </button>
      </div>

      {/* Center section */}
      <div className='flex-1 flex justify-center items-center'>
        <div ref={searchRef} className='relative w-96'>
          <div className='relative flex items-center'>
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search by content, title or tag...'
              className='w-full py-1.5 pl-3 pr-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-sm placeholder:font-normal'
            />
            <div className='absolute right-3 flex items-center'>
              <Search className='h-4 w-4 text-gray-500 dark:text-gray-400' />
            </div>
            {isSearching && searchQuery && (
              <div className='absolute right-10 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full'>
                {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className='w-64 flex items-center justify-end gap-2'>
        <ThemeToggle />
      </div>
    </header>
  );
};
