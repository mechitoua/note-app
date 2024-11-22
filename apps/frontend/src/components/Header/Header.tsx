import { SettingsMenu } from '@/components/Settings/SettingsMenu';
import { useNoteStore } from '@/store/useNoteStore';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
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
  const searchRef = useRef<HTMLInputElement>(null);
  const searchQuery = useNoteStore((state) => state.searchQuery);
  const setSearchQuery = useNoteStore((state) => state.setSearchQuery);
  const { currentTheme } = useThemeStore();
  const theme = defaultThemes[currentTheme] || defaultThemes.navy;

  const handleSearchFocus = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.select();
    }
  }, []);

  return (
    <header
      className='sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      role='banner'
    >
      {/* Left section */}
      <div className='w-64 flex items-center gap-2'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
          aria-label={`${isSidebarOpen ? 'Close' : 'Open'} sidebar menu`}
          aria-expanded={isSidebarOpen}
        >
          <Menu className='w-5 h-5 text-gray-600 dark:text-gray-400' aria-hidden='true' />
        </button>

        <button
          onClick={onLogoClick}
          className={`text-lg font-semibold text-gray-900 dark:text-white hover:${theme.colors.accent}`}
          aria-label='Go to home'
        >
          {title}
        </button>
      </div>

      {/* Center section */}
      <div className='flex-1 flex justify-center' aria-live='polite'>
        {isSearching && totalResults !== undefined && (
          <div className='text-sm text-gray-500 dark:text-gray-400' role='status'>
            Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className='w-auto flex items-center justify-end gap-3'>
        <div className='relative'>
          <input
            ref={searchRef}
            type='text'
            placeholder='Search by content, title or tag...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            className={`w-96 px-4 py-2 pl-10 text-sm ${theme.colors.primaryLight} border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-current hover:bg-opacity-80 dark:hover:bg-opacity-40 transition-colors ${theme.colors.text} placeholder:text-gray-500 dark:placeholder:text-gray-400`}
            aria-label='Search notes'
            role='searchbox'
            aria-expanded={isSearching}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.colors.accent}`}
            aria-hidden='true'
          />
        </div>
        <SettingsMenu />
      </div>
    </header>
  );
};
