import { CurrentView, Note } from '@/types';
import { ArchiveRestore } from 'lucide-react';
import { MobileHeader } from './MobileHeader';

interface MobileArchivedViewProps {
  notes: Note[];
  onUnarchive: (noteId: string) => Promise<void>;
  onNavigate: (view: CurrentView) => void;
  onNoteSelect: (note: Note) => void;
}

export const MobileArchivedView = ({
  notes,
  onUnarchive,
  onNoteSelect,
}: MobileArchivedViewProps) => {
  return (
    <div className="flex h-full flex-col">
      <MobileHeader title="Archived" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No archived notes</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className={`group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium text-card-foreground">{note.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onUnarchive(note.id);
                    }}
                    className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <ArchiveRestore className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {new Date(note.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
