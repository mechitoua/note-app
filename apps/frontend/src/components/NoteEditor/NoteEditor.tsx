import { Note } from '@/types/note';
import MDEditor from '@uiw/react-md-editor';
import { Save, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

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

    const convertMarkdownToPlainText = useCallback((markdown: string) => {
      if (!markdown) return '';

      // Keep a copy of the original text
      let text = markdown;

      // Replace multiple newlines with a placeholder
      text = text.replace(/\n{2,}/g, '\n[PARAGRAPH_BREAK]\n');

      // Remove headers while preserving content
      text = text.replace(/^#{1,6}\s+(.*?)$/gm, '$1');

      // Remove bold and italic while preserving content and spaces
      text = text.replace(/\*\*(.+?)\*\*/g, '$1'); // Bold
      text = text.replace(/\*(.+?)\*/g, '$1'); // Italic
      text = text.replace(/__(.+?)__/g, '$1'); // Bold
      text = text.replace(/_(.+?)_/g, '$1'); // Italic

      // Remove links but keep text and spaces
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      // Remove images
      text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

      // Remove code blocks while preserving content
      text = text.replace(/```[\s\S]*?```/g, '');
      text = text.replace(/`([^`]+)`/g, '$1');

      // Remove blockquotes while preserving content
      text = text.replace(/^\s*>\s*(.*?)$/gm, '$1');

      // Remove horizontal rules
      text = text.replace(/^[-*_]{3,}\s*$/gm, '');

      // Remove list markers while preserving content and indentation
      text = text.replace(/^(\s*)[*+-]\s+/gm, '$1');
      text = text.replace(/^(\s*)\d+\.\s+/gm, '$1');

      // Restore paragraph breaks
      text = text.replace(/\[PARAGRAPH_BREAK\]/g, '\n\n');

      // Clean up any remaining extra whitespace while preserving intentional line breaks
      text = text.replace(/\s*\n\s*/g, '\n');
      text = text.replace(/\n{3,}/g, '\n\n');
      
      return text;
    }, []);

    if (!selectedNote) return null;

    return (
      <div className='col-span-2 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900'>
        <div className='p-6 flex-1 flex flex-col'>
          <div className='space-y-4'>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setEditorMode('plain')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  editorMode === 'plain'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Plain Text
              </button>
              <button
                onClick={() => setEditorMode('markdown')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  editorMode === 'markdown'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Markdown
              </button>
            </div>
            <input
              type='text'
              value={noteTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder='Note title...'
              className='w-full text-2xl font-semibold px-3 py-2 border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-700 focus:outline-none transition-colors bg-transparent dark:text-white dark:placeholder-gray-400'
            />
          </div>
          <div className='flex-1 overflow-hidden mt-4'>
            {editorMode === 'markdown' ? (
              <MDEditor
                value={markdownContent}
                onChange={(val) => handleContentChange(val || '')}
                preview='edit'
                className='w-full h-full'
                height='100%'
                data-color-mode={
                  document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                }
                previewOptions={{
                  rehypePlugins: [],
                  remarkPlugins: [],
                }}
                textareaProps={{
                  placeholder: '',
                  style: {
                    backgroundColor: 'transparent',
                    color: 'inherit',
                  },
                }}
              />
            ) : (
              <textarea
                value={convertMarkdownToPlainText(markdownContent)}
                onChange={(e) => handleContentChange(e.target.value)}
                className='w-full h-full p-4 border rounded-lg focus:outline-none focus:border-blue-700 resize-none text-left bg-transparent dark:text-gray-200 dark:border-gray-700'
                placeholder=''
                style={{ textAlign: 'left' }}
              />
            )}
          </div>
        </div>
        <div className='mx-6 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-3'>
          <button
            onClick={onSave}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2'
          >
            <Save className='w-4 h-4' />
            Save
          </button>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2 text-gray-600 dark:text-gray-300'
          >
            <X className='w-4 h-4' />
            Cancel
          </button>
        </div>
      </div>
    );
  }
);
