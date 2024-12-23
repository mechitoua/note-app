import { useNoteStore } from '@/store/useNoteStore';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { Note } from '@/types/note';
import { normalizeTag } from '@/utils/tagUtils';
import { Archive, ArchiveRestore, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '../Button/Button';

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (note: Note) => void;
  onCreateNote?: () => void;
  onArchive?: (noteId: string) => void;
  onUnarchive?: (noteId: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  onCreateNote,
  onArchive,
  onUnarchive,
}) => {
  const searchQuery = useNoteStore(state => state.searchQuery);
  const selectedTag = useNoteStore(state => state.selectedTag);
  const currentView = useNoteStore(state => state.currentView);
  const { currentTheme } = useThemeStore();
  const theme = defaultThemes[currentTheme] || defaultThemes.navy;

  const filteredNotes = notes.filter(note => {
    // Filter by archive status
    if (currentView === 'archived' && !note.archived) return false;
    if (currentView === 'all-notes' && note.archived) return false;

    // Filter by selected tag (case-insensitive)
    if (selectedTag && !note.tags.some(tag => normalizeTag(tag) === normalizeTag(selectedTag)))
      return false;

    // Filter by search query
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="col-span-1 h-full w-70 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="sticky top-0 bg-white dark:bg-gray-900 py-6 px-4 z-10">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onCreateNote}
          className="flex items-center justify-center gap-2 py-3"
        >
          <Plus className="w-5 h-5" />
          Create New Note
        </Button>
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
              <p className="text-gray-600 dark:text-gray-400 mb-2">No notes created yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click the Create New Note button above to get started
              </p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <React.Fragment key={note.id}>
                <div
                  onClick={() => onNoteSelect(note)}
                  className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedNoteId === note.id
                      ? `${theme.colors.primaryLight}`
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-grow">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 flex items-center">
                            {note.title || 'Untitled Note'}
                            {note.archived && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                                Archived
                              </span>
                            )}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              note.archived ? onUnarchive?.(note.id) : onArchive?.(note.id);
                            }}
                            className={`flex items-center gap-1.5 ${
                              selectedNoteId === note.id
                                ? 'text-current opacity-75'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {note.archived ? (
                              <ArchiveRestore className="w-4 h-4" />
                            ) : (
                              <Archive className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            {note.tags.map(tag => (
                              <span
                                key={tag}
                                className={`px-1.5 py-0.5 rounded text-xs font-medium truncate max-w-full ${
                                  selectedNoteId === note.id
                                    ? 'bg-white/20 text-current'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                          {new Date(note.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
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
