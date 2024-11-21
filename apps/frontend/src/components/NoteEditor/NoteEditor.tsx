import MDEditor from '@uiw/react-md-editor';
import { Save, X } from 'lucide-react';
import { memo, useCallback, useState, useEffect } from 'react';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  selectedTag?: string | null;
}

export const NoteEditor = memo(
  ({ title, content, onTitleChange, onContentChange, onSave, onCancel, selectedTag }: NoteEditorProps) => {
    // Initialize in markdown mode with preview
    const [editorMode, setEditorMode] = useState<'markdown' | 'plain'>('markdown');
    const [isPreview, setIsPreview] = useState(true);

    const handleModeChange = (mode: 'markdown' | 'plain') => {
      setEditorMode(mode);
      if (mode === 'markdown') {
        setIsPreview(true);
      }
    };

    useEffect(() => {
      if (selectedTag) {
        setEditorMode('markdown');
      }
    }, [selectedTag]);

    useEffect(() => {
      if (selectedTag) {
        setEditorMode('markdown');
      }
    }, []); // Run once on mount

    const convertMarkdownToPlainText = useCallback((markdown: string) => {
      if (!markdown) return '';

      // Keep a copy of the original text
      let text = markdown;

      // Replace multiple newlines with a single newline
      text = text.replace(/\n{2,}/g, '\n');

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

      // Remove list markers while preserving content
      text = text.replace(/^\s*[-*+]\s+/gm, '');
      text = text.replace(/^\s*\d+\.\s+/gm, '');

      // Replace any remaining multiple spaces with a single space
      text = text.replace(/\s+/g, ' ');

      return text.trim();
    }, []);

    const convertPlainTextToMarkdown = useCallback((text: string) => {
      if (!text) return '';
      return text;
    }, []);

    const handleContentChange = useCallback((newContent: string) => {
      if (editorMode === 'markdown') {
        onContentChange(newContent);
      } else {
        onContentChange(convertPlainTextToMarkdown(newContent));
      }
    }, [editorMode, onContentChange, convertPlainTextToMarkdown]);

    return (
      <div className='h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900'>
        <div className='p-6 flex-1 flex flex-col'>
          <div className='space-y-4'>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => handleModeChange('plain')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  editorMode === 'plain'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Plain Text
              </button>
              <button
                onClick={() => handleModeChange('markdown')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  editorMode === 'markdown'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Markdown
              </button>
              {editorMode === 'markdown' && (
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    isPreview
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              )}
            </div>
            <input
              type='text'
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder='Note title...'
              className='w-full text-2xl font-semibold px-3 py-2 border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-indigo-700 focus:outline-none transition-colors bg-transparent dark:text-white dark:placeholder-gray-400'
            />
          </div>
          <div className='flex-1 overflow-hidden mt-4'>
            {editorMode === 'markdown' ? (
              <div className='h-full [&_.w-md-editor-text]:!min-h-full [&_.w-md-editor]:!border-none [&_.w-md-editor-content]:!border-none [&_.w-md-editor-area]:!border-none [&_*]:!outline-none [&_.w-md-editor-text-pre>code]:!text-base [&_.w-md-editor-text-input]:!text-base [&_.wmde-markdown-var]:!text-base [&_.wmde-markdown]:!text-base'>
                <MDEditor
                  value={content}
                  onChange={(val) => handleContentChange(val || '')}
                  preview={isPreview ? 'preview' : 'edit'}
                  hideToolbar={isPreview}
                  className='w-full h-full p-4 focus:outline-none resize-none text-left bg-transparent dark:text-gray-200'
                  visibleDragbar={false}
                  data-color-mode={
                    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                  }
                  previewOptions={{
                    rehypePlugins: [],
                    remarkPlugins: [],
                  }}
                  textareaProps={{
                    placeholder: 'Start writing...',
                    className:
                      'w-full h-full p-4 focus:outline-none resize-none text-left bg-transparent dark:text-gray-200',
                    style: {
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      outline: 'none',
                      fontSize: '1rem'
                    },
                  }}
                />
              </div>
            ) : (
              <textarea
                value={convertMarkdownToPlainText(content)}
                onChange={(e) => handleContentChange(e.target.value)}
                className='w-full h-full p-4 focus:outline-none resize-none text-left bg-transparent dark:text-gray-200 text-base'
                placeholder='Start writing...'
                style={{ textAlign: 'left' }}
              />
            )}
          </div>
          <div className='flex justify-start gap-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4'>
            <button
              onClick={onCancel}
              className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2'
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
            <button
              onClick={onSave}
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-2'
            >
              <Save className='w-4 h-4' />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
);
