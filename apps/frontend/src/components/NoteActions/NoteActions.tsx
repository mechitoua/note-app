import { Archive, Clock, Tag, Trash2 } from 'lucide-react';
import { Note } from '@/types/note';

interface NoteActionsProps {
  note: Note;
  onArchive: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const NoteActions = ({ note, onArchive, onDelete }: NoteActionsProps) => {
  return (
    <div className='col-span-1 h-full border-l border-gray-200 bg-white'>
      <div className='p-6 space-y-6'>
        {/* Note Info Section */}
        <div className='space-y-4'>
          <div className='flex items-start gap-2'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Tag className='w-4 h-4' />
            </div>
            <div className='flex-1'>
              <div className='text-sm font-medium text-gray-600 mb-2'>Tags</div>
              <div className='flex flex-wrap gap-1'>
                {note.tags.length > 0 ? (
                  note.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-2 py-0.5 bg-gray-300 text-gray-800 rounded-md text-xs font-medium'
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className='text-sm text-gray-500'>No tags</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-start gap-2'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='w-4 h-4' />
          </div>
          <div className='flex-1'>
            <div className='text-sm font-medium text-gray-600 mb-1'>Last edited</div>
            <div className='text-sm text-gray-500'>
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className='border-t border-gray-200 pt-6'>
          <div className='space-y-3'>
            <button
              onClick={() => onArchive(note)}
              className='w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium'
            >
              <Archive className='w-4 h-4' />
              Archive Note
            </button>
            <button
              onClick={() => onDelete(note)}
              className='w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium'
            >
              <Trash2 className='w-4 h-4' />
              Delete Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
