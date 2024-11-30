import { NoteEditor } from '@/components/NoteEditor';
import { Note } from '@/types';
import { useFontStore } from '@/store/useFontStore';
import { Archive, ChevronLeft, Save, Trash } from 'lucide-react';
import { MobileHeader } from './MobileHeader';

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
  const { currentFont } = useFontStore();

  const formattedDate = note?.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Not saved';

  return (
    <div className="flex h-full flex-col bg-background">
      <MobileHeader title="Edit Note" />
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Go back</span>
        </button>
        <div className="flex items-center space-x-3">
          <button onClick={onDelete} className="text-destructive hover:text-destructive/80">
            <Trash className="h-5 w-5" />
          </button>
          <button onClick={onArchive} className="text-muted-foreground hover:text-foreground">
            <Archive className="h-5 w-5" />
          </button>
          <button onClick={onSave} className="text-primary hover:text-primary/80">
            <Save className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Title and Info */}
        <div className="py-3">
          <input
            type="text"
            value={content.title}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Note title"
            className="w-full bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground"
            style={{ fontFamily: currentFont.fontFamily }}
          />
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {note?.tags?.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Last edited: {formattedDate}</div>
          </div>
        </div>

        {/* Editor */}
        <NoteEditor
          value={content.content}
          onChange={value => onContentChange(value || '')}
          preview="edit"
          className="min-h-[200px] prose-sm prose-neutral dark:prose-invert"
          style={{ fontFamily: currentFont.fontFamily }}
        />
      </div>
    </div>
  );
};
