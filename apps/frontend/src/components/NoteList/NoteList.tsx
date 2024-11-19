import { Plus } from 'lucide-react';
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
    <div className='col-span-1 h-full border-r border-gray-200 overflow-y-auto'>
      <div className='p-4'>
        <button 
          onClick={onNewNote}
          className='w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-blue-700 text-white rounded-lg transition-colors hover:bg-blue-800 font-medium'
        >
          <Plus className='w-5 h-5' />
          <span>New Note</span>
        </button>
        <div className='space-y-2'>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteClick(note)}
              className={`p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                selectedNote?.id === note.id ? 'border-blue-700' : ''
              }`}
            >
              <h3 className='font-medium text-gray-900 mb-2'>{note.title}</h3>
              <div className='flex flex-wrap gap-1 mb-2'>
                {note.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className='px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className='text-xs text-gray-500'>
                {new Date(note.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
