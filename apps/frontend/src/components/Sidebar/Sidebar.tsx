import { CurrentView } from '@/types';
import { ArchiveBold, ChevronRightBold, PenSquareBold, HomeBold, PlusBold, TagBold } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  isOpen: boolean;
  currentView: CurrentView;
  onViewChange: Dispatch<SetStateAction<CurrentView>>;
  tags: string[];
}

export const Sidebar = ({ isOpen, currentView, onViewChange, tags }: SidebarProps) => {
  return (
    <aside
      className={`bg-white border-r border-gray-200 ${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo Section */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center gap-2'>
          <PenSquareBold className='w-6 h-6 text-blue-700' />
          <h1 className='text-xl font-semibold text-gray-900'>AppNote</h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='p-3'>
        <button
          onClick={() => onViewChange('all-notes')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'all-notes'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <HomeBold className='w-5 h-5 text-blue-700' />
          <span>All Notes</span>
          {currentView === 'all-notes' && <ChevronRightBold className='w-4 h-4 ml-auto' />}
        </button>
        <button
          onClick={() => onViewChange('archived')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'archived'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArchiveBold className='w-5 h-5 text-blue-700' />
          <span>Archived</span>
          {currentView === 'archived' && <ChevronRightBold className='w-4 h-4 ml-auto' />}
        </button>
      </div>

      {/* Tags Section */}
      <div className='p-3 border-t border-gray-200'>
        <div className='flex items-center justify-between px-3 mb-2'>
          <h2 className='text-sm font-medium text-gray-500'>Tags</h2>
          <button
            className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => {
              // TODO: Implement add tag functionality
              console.log('Add tag clicked');
            }}
          >
            <PlusBold className='w-4 h-4 text-gray-500' />
          </button>
        </div>
        <div className='space-y-1'>
          {tags.map((tag) => (
            <button
              key={tag}
              className='w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
            >
              <TagBold className='w-4 h-4 text-blue-700' />
              <span className='text-sm capitalize'>{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
