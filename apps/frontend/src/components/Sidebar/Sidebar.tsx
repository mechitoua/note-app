import { CurrentView } from '@/types';
import { Archive, ChevronRight, Feather, Home, Plus, Tag } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  isOpen: boolean;
  currentView: CurrentView;
  onViewChange: Dispatch<SetStateAction<CurrentView>>;
  tags: string[];
  onAllNotesClick: () => void;
}

export const Sidebar = ({ isOpen, currentView, onViewChange, tags, onAllNotesClick }: SidebarProps) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${
        isOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo Section */}
      <div className='p-4 pt-5'>
        <div className='flex items-center gap-3'>
          <Feather className='w-6 h-6 text-blue-600 dark:text-blue-500 flex-shrink-0' />
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white font-borel leading-none flex items-center mt-2'>
            Notes
          </h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='p-3'>
        <button
          onClick={() => {
            onViewChange('all-notes');
            onAllNotesClick();
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'all-notes'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Home className='w-5 h-5 text-blue-600 dark:text-blue-500' />
          <span>All Notes</span>
          {currentView === 'all-notes' && <ChevronRight className='w-4 h-4 ml-auto' />}
        </button>
        <button
          onClick={() => onViewChange('archived')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'archived'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Archive className='w-5 h-5 text-blue-600 dark:text-blue-500' />
          <span>Archived</span>
          {currentView === 'archived' && <ChevronRight className='w-4 h-4 ml-auto' />}
        </button>
      </div>

      {/* Tags Section */}
      <div className='p-3 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between px-3 mb-2'>
          <h2 className='text-sm font-medium text-gray-500 dark:text-gray-400'>Tags</h2>
          <button
            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
            onClick={() => {
              // TODO: Implement add tag functionality
              console.log('Add tag clicked');
            }}
          >
            <Plus className='w-4 h-4 text-gray-500 dark:text-gray-400' />
          </button>
        </div>
        <div className='space-y-1'>
          {tags.map((tag) => (
            <button
              key={tag}
              className='w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium'
            >
              <Tag className='w-4 h-4 text-blue-600 dark:text-blue-500' />
              <span className='text-sm capitalize'>{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
