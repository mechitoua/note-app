import { useNoteStore } from '@/store/useNoteStore';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { Note } from '@/types/note';
import { Archive, ArchiveRestore } from 'lucide-react';
import React from 'react';

interface ArchivedNotesProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  onUnarchive?: (noteId: string) => void;
  selectedNoteId: string;
}

export const ArchivedNotes = ({
  notes,
  onNoteSelect,
  onUnarchive,
  selectedNoteId,
}: ArchivedNotesProps) => {
  const searchQuery = useNoteStore(state => state.searchQuery);
  const { currentTheme } = useThemeStore();
  const theme = defaultThemes[currentTheme] || defaultThemes.navy;
  const themeAccent = theme.colors.accent;
  const themePrimaryLight = theme.colors.primaryLight;

  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleUnarchive = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnarchive) {
      await onUnarchive(note.id);
    }
  };

  return (
    <div className="col-span-1 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 z-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Archive className={`w-5 h-5 ${themeAccent}`} />
          Archived Notes
        </h2>
      </div>
      <div
        className="h-[calc(100vh-8rem)] overflow-y-auto px-4 pb-4"
        style={
          {
            '--scrollbar-width': '8px',
            '--scrollbar-track-bg': 'transparent',
            '--scrollbar-thumb-bg': 'rgb(229 231 235)',
            '--scrollbar-thumb-bg-dark': 'rgb(31 41 55)',
            '--scrollbar-thumb-hover': 'rgb(209 213 219)',
            '--scrollbar-thumb-hover-dark': 'rgb(17 24 39)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--scrollbar-thumb-bg) var(--scrollbar-track-bg)',
          } as React.CSSProperties
        }
      >
        <style>
          {`
            .dark div[style*="--scrollbar-thumb-bg"] {
              scrollbar-color: var(--scrollbar-thumb-bg-dark) var(--scrollbar-track-bg) !important;
            }
            div[style*="--scrollbar-width"]::-webkit-scrollbar {
              width: var(--scrollbar-width);
            }
            div[style*="--scrollbar-width"]::-webkit-scrollbar-track {
              background: var(--scrollbar-track-bg);
            }
            div[style*="--scrollbar-width"]::-webkit-scrollbar-thumb {
              background: var(--scrollbar-thumb-bg);
              border-radius: 9999px;
            }
            div[style*="--scrollbar-width"]::-webkit-scrollbar-thumb:hover {
              background: var(--scrollbar-thumb-hover);
            }
            .dark div[style*="--scrollbar-width"]::-webkit-scrollbar-thumb {
              background: var(--scrollbar-thumb-bg-dark) !important;
            }
            .dark div[style*="--scrollbar-width"]::-webkit-scrollbar-thumb:hover {
              background: var(--scrollbar-thumb-hover-dark) !important;
            }
          `}
        </style>
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Archive className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">No archived notes</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Notes you archive will appear here
              </p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <React.Fragment key={note.id}>
                <div
                  onClick={() => onNoteSelect(note)}
                  className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    note.id === selectedNoteId
                      ? `${themePrimaryLight}`
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-grow">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {note.title || 'Untitled Note'}
                          </h3>
                          <button
                            onClick={e => handleUnarchive(note, e)}
                            className={`p-2 text-gray-500 dark:text-gray-400 hover:${themeAccent} transition-colors`}
                            title="Unarchive note"
                          >
                            <ArchiveRestore className="w-4 h-4" />
                          </button>
                        </div>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            {note.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 text-xs font-medium truncate max-w-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {note.content || 'No content'}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(note.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-800" />
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
