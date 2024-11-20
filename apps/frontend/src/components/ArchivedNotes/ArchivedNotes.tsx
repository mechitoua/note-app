import { Note } from '@/types/note';
import { Archive } from 'lucide-react';

interface ArchivedNotesProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
}

export const ArchivedNotes = ({ notes, onNoteSelect }: ArchivedNotesProps) => {
  return (
    <div className='col-span-1 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700'>
      <div className='sticky top-0 bg-white dark:bg-gray-900 p-4 z-10'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
          <Archive className='w-5 h-5 text-indigo-600 dark:text-indigo-500' />
          Archived Notes
        </h2>
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
          {notes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
              <Archive className='w-12 h-12 text-gray-400 dark:text-gray-600 mb-4' />
              <p className='text-gray-600 dark:text-gray-400 mb-2'>No archived notes</p>
              <p className='text-sm text-gray-500 dark:text-gray-500'>
                Notes you archive will appear here
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className='p-4 rounded-lg border cursor-pointer transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <div className='space-y-2'>
                  <h3 className='font-semibold text-gray-900 dark:text-white text-base leading-snug line-clamp-2'>
                    {note.title || 'Untitled Note'}
                  </h3>
                  {note.content && (
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                      {note.content}
                    </p>
                  )}
                  {note.tags && note.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-2 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full text-xs font-medium'
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};