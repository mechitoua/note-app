import { NoteEditor } from '@/components/NoteEditor';
import { Note } from '@/types';
import { Archive, ChevronLeft, Save, Trash } from 'lucide-react';

interface MobileNoteEditorProps {
  note: Note;
  content: {
    title: string;
    content: string;
  };
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onBack: () => void;
}

export const MobileNoteEditor = ({
  note,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  onArchive,
  onBack,
}: MobileNoteEditorProps) => {
  const formattedDate = note?.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Not saved';

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onDelete} className="text-destructive hover:text-destructive/80">
            <Trash className="h-5 w-5" />
          </button>
          <button onClick={onArchive} className="text-muted-foreground hover:text-foreground">
            <Archive className="h-5 w-5" />
          </button>
          <button onClick={onSave} className="text-primary hover:text-primary/80">
            <Save className="mr-1 h-5 w-5" />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Title and Tags */}
        <div className="py-4">
          <input
            type="text"
            value={content.title}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Note title"
            className="w-full bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Tags</span>
              {note?.tags?.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span>Last edited {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <NoteEditor
          value={content.content}
          onChange={value => onContentChange(value || '')}
          preview="edit"
          className="min-h-[200px] prose-sm prose-neutral dark:prose-invert"
        />
      </div>
    </div>
  );
};
