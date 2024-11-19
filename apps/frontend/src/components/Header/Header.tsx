import { Menu } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  title: string;
  onLogoClick: () => void;
}

export const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  title,
  onLogoClick
}: HeaderProps) => {
  return (
    <header className='h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <Menu className='w-5 h-5 text-gray-600' />
        </button>
        <button
          onClick={onLogoClick}
          className='text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors'
        >
          Note App
        </button>
      </div>
      <div className='text-sm font-medium text-gray-600'>{title}</div>
    </header>
  );
};
