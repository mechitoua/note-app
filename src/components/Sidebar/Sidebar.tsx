import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { CurrentView } from '@/types';
import { normalizeTag } from '@/utils/tagUtils';
import { Archive, ChevronRight, Feather, Home, Tag } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
  isOpen: boolean;
  currentView: CurrentView;
  onViewChange: Dispatch<SetStateAction<CurrentView>>;
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  onAllNotesClick: () => void;
  className?: string;
}

export const Sidebar = ({
  isOpen,
  currentView,
  onViewChange,
  tags,
  selectedTag,
  onTagSelect,
  onAllNotesClick,
  className,
}: SidebarProps) => {
  const { currentTheme } = useThemeStore();
  const theme = defaultThemes[currentTheme] || defaultThemes.navy;

  const isTagSelected = (tag: string) => {
    return selectedTag && normalizeTag(tag) === normalizeTag(selectedTag);
  };

  return (
    <aside
      className={`${className || ''} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${
        isOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-3 pt-4">
        <div className="flex items-center gap-2">
          <Feather className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white font-borel">
            Notes
          </h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4">
        <button
          onClick={() => {
            onViewChange('all-notes');
            onAllNotesClick();
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'all-notes' && !selectedTag
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Home
            className={`w-5 h-5 ${
              currentView === 'all-notes' && !selectedTag 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          />
          <span>All Notes</span>
          {currentView === 'all-notes' && !selectedTag && (
            <ChevronRight className="w-4 h-4 ml-auto text-gray-900 dark:text-white" />
          )}
        </button>
        <button
          onClick={() => {
            onViewChange('archived');
            onTagSelect(null);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
            currentView === 'archived'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Archive
            className={`w-5 h-5 ${
              currentView === 'archived' 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          />
          <span>Archived</span>
          {currentView === 'archived' && (
            <ChevronRight className="w-4 h-4 ml-auto text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Tags Section */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-3 px-6">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</h2>
        </div>
        <div
          className="flex-1 overflow-y-auto px-3 pb-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(156 163 175) transparent',
          }}
        >
          <div className="space-y-1">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (isTagSelected(tag)) {
                    onTagSelect(null);
                  } else {
                    onTagSelect(tag);
                    onViewChange('all-notes');
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isTagSelected(tag)
                    ? `${theme.colors.primary} text-white`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Tag
                  className={`w-3.5 h-3.5 ${isTagSelected(tag) ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                />
                <span className="truncate text-sm font-medium">{tag}</span>
                {isTagSelected(tag) && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
