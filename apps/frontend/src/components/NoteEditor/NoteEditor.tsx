import MDEditor from '@uiw/react-md-editor';
import { Note } from '@types/note';
import { useState, memo } from 'react';

interface NoteEditorProps {
  selectedNote: Note | null;
  markdownContent: string;
  noteTitle: string;
  handleContentChange: (content: string) => void;
  handleTitleChange: (title: string) => void;
}

export const NoteEditor = memo(({
  selectedNote,
  markdownContent,
  noteTitle,
  handleContentChange,
  handleTitleChange,
}: NoteEditorProps) => {
  const [editorMode, setEditorMode] = useState<'markdown' | 'plain'>('plain');
  
  if (!selectedNote) return null;

  return (
    <div className='col-span-2 p-6 flex flex-col h-full overflow-hidden bg-white'>
      <div className="flex justify-between items-center mb-4">
        <input
          type='text'
          value={noteTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder='Note title...'
          className='text-2xl font-semibold px-2 py-1 border-b border-transparent hover:border-gray-200 focus:border-blue-700 focus:outline-none transition-colors flex-1'
        />
        <div className="flex gap-2">
          <button
            onClick={() => setEditorMode('plain')}
            className={`px-3 py-1 rounded-lg text-sm ${
              editorMode === 'plain'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Plain Text
          </button>
          <button
            onClick={() => setEditorMode('markdown')}
            className={`px-3 py-1 rounded-lg text-sm ${
              editorMode === 'markdown'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Markdown
          </button>
        </div>
      </div>
      <div className='flex-1 overflow-hidden'>
        {editorMode === 'markdown' ? (
          <MDEditor
            value={markdownContent}
            onChange={(val) => handleContentChange(val || '')}
            preview='edit'
            className='w-full h-full'
            height="100%"
            data-color-mode="light"
            previewOptions={{
              rehypePlugins: [],
              remarkPlugins: []
            }}
            textareaProps={{
              placeholder: 'Start writing in markdown...',
              "data-color-mode": "light",
              style: { 
                backgroundColor: 'white',
                color: '#374151'
              }
            }}
          />
        ) : (
          <textarea
            value={markdownContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className='w-full h-full p-4 border rounded-lg focus:outline-none focus:border-blue-700 resize-none text-left'
            placeholder='Start writing...'
            style={{ textAlign: 'left' }}
          />
        )}
      </div>
    </div>
  );
});
