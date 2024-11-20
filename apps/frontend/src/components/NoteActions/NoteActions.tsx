import { Archive, Clock, Tag, Trash2 } from 'lucide-react';
import { Note } from '@/types/note';

interface NoteActionsProps {
  selectedNote: Note;
  onArchive: () => void;
  onDelete: () => void;
}

export const NoteActions = ({ selectedNote, onArchive, onDelete }: NoteActionsProps) => {
  return (
    <div className='col-span-1 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
      <div className='h-full p-3 space-y-4'>
        {/* Note Info Section */}
        <div className='space-y-3'>
          <div className='flex items-start gap-2'>
            <Tag className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <div className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5'>Tags</div>
              <div className='flex flex-wrap gap-1'>
                {selectedNote.tags && selectedNote.tags.length > 0 ? (
                  selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-1.5 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-medium truncate max-w-full'
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className='text-xs text-gray-500 dark:text-gray-400'>No tags</span>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-start gap-2'>
            <Clock className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <div className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>Last edited</div>
              <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {new Date(selectedNote.updatedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
          <div className='space-y-2'>
            <button
              onClick={onArchive}
              className='w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-xs'
            >
              <Archive className='w-3.5 h-3.5' />
              {selectedNote.archived ? 'Unarchive' : 'Archive'}
            </button>
            <button
              onClick={onDelete}
              className='w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-xs'
            >
              <Trash2 className='w-3.5 h-3.5' />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
