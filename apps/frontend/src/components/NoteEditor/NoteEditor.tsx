import { Note } from '@/types/note';
import MDEditor from '@uiw/react-md-editor';
import { memo, useState } from 'react';
import { Save, X } from 'lucide-react';

interface NoteEditorProps {
  selectedNote: Note | null;
  markdownContent: string;
  noteTitle: string;
  handleContentChange: (content: string) => void;
  handleTitleChange: (title: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const NoteEditor = memo(
  ({
    selectedNote,
    markdownContent,
    noteTitle,
    handleContentChange,
    handleTitleChange,
    onSave,
    onCancel,
  }: NoteEditorProps) => {
    const [editorMode, setEditorMode] = useState<'markdown' | 'plain'>('plain');

    if (!selectedNote) return null;

    return (
      <div className='col-span-2 flex flex-col h-full overflow-hidden bg-white'>
        <div className='p-6 flex-1 flex flex-col'>
          <div className='flex justify-between items-center mb-4'>
            <input
              type='text'
              value={noteTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder='Note title...'
              className='text-2xl font-semibold px-2 py-1 border-b border-transparent hover:border-gray-200 focus:border-blue-700 focus:outline-none transition-colors flex-1'
            />
            <div className='flex gap-2'>
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
                height='100%'
                data-color-mode='light'
                previewOptions={{
                  rehypePlugins: [],
                  remarkPlugins: [],
                }}
                textareaProps={{
                  placeholder: 'Start writing in markdown...',
                  style: {
                    backgroundColor: 'white',
                    color: '#374151',
                  },
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
        {/* Editor Actions */}
        <div className='mx-6 px-6 py-4 border-t border-gray-200 bg-white flex gap-3'>
          <button
            onClick={onSave}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2'
          >
            <Save className='w-4 h-4' />
            Save Note
          </button>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium inline-flex items-center gap-2'
          >
            <X className='w-4 h-4' />
            Cancel
          </button>
        </div>
      </div>
    );
  }
);
