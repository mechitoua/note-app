import { Menu, Search, Settings } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  title: string;
}

export const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  title,
}: HeaderProps) => {
  return (
    <div className='border-b border-gray-200 flex-shrink-0'>
      <div className='flex items-center justify-between p-6'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </button>
          <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Search className='w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search in all notes...'
              className='w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors'
            />
          </div>
          <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <Settings className='w-5 h-5 text-gray-600' />
          </button>
        </div>
      </div>
    </div>
  );
};
