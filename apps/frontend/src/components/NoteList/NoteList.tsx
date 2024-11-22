import { Note } from '@/types/note';
import { Plus, Archive, ArchiveRestore } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';

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
  onUnarchive
}) => {
  const searchQuery = useNoteStore(state => state.searchQuery);

  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className='col-span-1 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700'>
      <div className='sticky top-0 bg-white dark:bg-gray-900 p-4 z-10'>
        <button
          onClick={onCreateNote}
          className='w-full flex items-center justify-center gap-2 px-3 py-2 text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Create New Note
        </button>
      </div>
      <div
        className='h-[calc(100vh-8rem)] overflow-y-auto px-4 pb-4'
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
        <div className='space-y-2'>
          {filteredNotes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
              <p className='text-gray-600 dark:text-gray-400 mb-2'>No notes created yet</p>
              <p className='text-sm text-gray-500 dark:text-gray-500'>Click the "Create New Note" button above to get started</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedNoteId === note.id
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div className='space-y-2 flex-grow'>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 flex items-center">
                          {note.title || 'Untitled Note'}
                          {note.archived && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                              Archived
                            </span>
                          )}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            note.archived 
                              ? onUnarchive?.(note.id)
                              : onArchive?.(note.id);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={note.archived ? 'Unarchive note' : 'Archive note'}
                        >
                          {note.archived ? (
                            <ArchiveRestore className="w-4 h-4" />
                          ) : (
                            <Archive className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1.5 mt-2'>
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className='px-1.5 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-medium truncate max-w-full'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {new Date(note.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
