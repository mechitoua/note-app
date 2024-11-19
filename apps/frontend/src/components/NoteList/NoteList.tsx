import { PlusBold } from 'lucide-react';
import { Note } from '@types/note';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteClick: (note: Note) => void;
  onNewNote: () => void;
}

export const NoteList = ({
  notes,
  selectedNote,
  onNoteClick,
  onNewNote,
}: NoteListProps) => {
  return (
    <div className='col-span-1 h-full bg-white border-r border-gray-200'>
      <div className='p-4'>
        <button
          onClick={onNewNote}
          className='w-full flex items-center justify-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
        >
          <PlusBold className='w-4 h-4' />
          New Note
        </button>
      </div>
      <div className='overflow-y-auto h-[calc(100%-4rem)] px-4 pb-4'>
        <div className='space-y-2'>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteClick(note)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <h3 className='font-medium text-gray-900 mb-2'>{note.title}</h3>
              <div className='flex flex-wrap gap-1 mb-2'>
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-0.5 bg-gray-300 text-gray-800 rounded-full text-xs font-medium'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className='text-sm text-gray-500 line-clamp-2 mb-2'>
                {note.content}
              </p>
              <p className='text-xs text-gray-400'>
                {new Date(note.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
