import { useState, useEffect } from 'react';
import { Archive, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/atoms';
import { Note } from '@/types/note';

interface EditorProps {
  note: Note | null;
  content: {
    title: string;
    content: string;
  };
  onUpdate: (note: { title: string; content: string; tags: string[] }) => void;
  onDelete: () => void;
  onArchive: () => void;
}

export const Editor = ({ note, content, onUpdate, onDelete, onArchive }: EditorProps) => {
  const [title, setTitle] = useState(content.title);
  const [noteContent, setNoteContent] = useState(content.content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(content.title);
    setNoteContent(content.content);
  }, [content]);

  const handleSave = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      await onUpdate({
        title,
        content: noteContent,
        tags: note.tags || [],
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Note Selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a note to view or edit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="flex-1 bg-transparent border-0 text-lg font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onArchive}
              title="Archive Note"
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              title="Delete Note"
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full min-h-[calc(100vh-10rem)] bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
