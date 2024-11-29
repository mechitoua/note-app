/* eslint-disable react-hooks/exhaustive-deps */
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import MDEditor from '@uiw/react-md-editor';
import { Clock, Save, Tag, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button/Button';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  selectedTag?: string | null;
  tags?: string[];
  lastEdited?: string;
}

export const NoteEditor = memo(
  ({
    title,
    content,
    onTitleChange,
    onContentChange,
    onSave,
    onCancel,
    selectedTag,
    tags = [],
    lastEdited,
  }: NoteEditorProps) => {
    // Initialize in markdown mode with preview
    const [editorMode, setEditorMode] = useState<'markdown' | 'plain'>('markdown');
    const [isPreview, setIsPreview] = useState(true);
    const { currentTheme } = useThemeStore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = defaultThemes[currentTheme] || defaultThemes.navy;

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

    const handleContentChange = useCallback(
      (newContent: string) => {
        if (editorMode === 'markdown') {
          onContentChange(newContent);
        } else {
          onContentChange(convertPlainTextToMarkdown(newContent));
        }
      },
      [editorMode, onContentChange, convertPlainTextToMarkdown]
    );

    return (
      <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-6 flex-1 flex flex-col">
          {/* Editor Header Section */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none w-full focus:ring-0 p-0"
              placeholder="Untitled Note"
            />
            <div className="space-y-2 mb-4 w-[70%]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Tag size={14} />
                  <span>Tags</span>
                </div>
                <div className="text-gray-900 dark:text-gray-100 text-sm">{tags.join(', ')}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock size={14} />
                  <span className="text-sm">Last edited</span>
                </div>
                <div className="text-gray-900 dark:text-gray-100 text-sm">{lastEdited}</div>
              </div>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700" />
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant={editorMode === 'plain' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('plain')}
              >
                Plain Text
              </Button>
              <Button
                variant={editorMode === 'markdown' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('markdown')}
              >
                Markdown
              </Button>
              {editorMode === 'markdown' && (
                <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)}>
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
              )}
            </div>
            <div className="flex-1 min-h-0">
              {editorMode === 'markdown' ? (
                <div className="h-full [&_.w-md-editor-text]:!min-h-full [&_.w-md-editor]:!border-none [&_.w-md-editor-content]:!border-none [&_.w-md-editor-area]:!border-none [&_*]:!outline-none [&_.w-md-editor-text-pre>code]:!text-base [&_.w-md-editor-text-input]:!text-base [&_.wmde-markdown-var]:!text-base [&_.wmde-markdown]:!text-base">
                  <MDEditor
                    value={content}
                    onChange={val => handleContentChange(val || '')}
                    preview={isPreview ? 'preview' : 'edit'}
                    hideToolbar={isPreview}
                    className="w-full h-full focus:outline-none resize-none text-left bg-transparent dark:text-gray-200"
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
                        'w-full h-full focus:outline-none resize-none text-left bg-transparent dark:text-gray-200',
                      style: {
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        outline: 'none',
                        fontSize: '1rem',
                      },
                    }}
                  />
                </div>
              ) : (
                <textarea
                  value={convertMarkdownToPlainText(content)}
                  onChange={e => handleContentChange(e.target.value)}
                  className="w-full h-full focus:outline-none resize-none text-left bg-transparent dark:text-gray-200 text-base"
                  placeholder="Start writing..."
                  style={{ textAlign: 'left' }}
                />
              )}
            </div>
            <div className="flex justify-start gap-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button variant="primary" size="sm" onClick={onSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

NoteEditor.displayName = 'NoteEditor';
