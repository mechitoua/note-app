import { Archive, Trash2 } from 'lucide-react';
import { Note } from '@types/note';

interface NoteActionsProps {
  note: Note;
  onArchive: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const NoteActions = ({ note, onArchive, onDelete }: NoteActionsProps) => {
  return (
    <div className='col-span-1 h-full border-l border-gray-200 bg-white'>
      <div className='p-6'>
        <h2 className='text-sm font-medium text-gray-500 mb-4'>Note Actions</h2>
        <div className='space-y-3'>
          <button
            onClick={() => onArchive(note)}
            className='w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Archive className='w-4 h-4' />
            Archive Note
          </button>
          <button
            onClick={() => onDelete(note)}
            className='w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'
          >
            <Trash2 className='w-4 h-4' />
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};
