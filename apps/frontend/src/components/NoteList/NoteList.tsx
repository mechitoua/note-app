import { Note } from '@/types/note';
import { Plus } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteClick: (note: Note) => void;
  onNewNote: () => void;
}

export const NoteList = ({ notes, selectedNote, onNoteClick, onNewNote }: NoteListProps) => {
  return (
    <div className='col-span-1 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700'>
      <div className='p-4'>
        <button
          onClick={onNewNote}
          className='w-full flex items-center justify-center gap-2 px-3 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
        >
          <Plus className='w-4 h-4' />
          Create New Note
        </button>
      </div>
      <div className='overflow-y-auto h-[calc(100%-4rem)] px-4 pb-4'>
        <div className='space-y-2'>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteClick(note)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className='space-y-2'>
                <h3 className='font-semibold text-gray-900 dark:text-white text-base leading-snug line-clamp-2'>
                  {note.title || 'Untitled Note'}
                </h3>
                <div className='flex flex-wrap gap-1.5'>
                  {note.tags?.map((tag) => (
                    <span
                      key={tag}
                      className='px-2 py-0.5 bg-gray-300 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
