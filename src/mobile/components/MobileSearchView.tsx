import { CurrentView, Note } from '@/types';
import { Search, X } from 'lucide-react';

interface MobileSearchViewProps {
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: CurrentView) => void;
  onNoteSelect: (note: Note) => void;
}

export const MobileSearchView = ({
  notes,
  searchQuery,
  onSearchChange,
  onNavigate,
  onNoteSelect,
}: MobileSearchViewProps) => {
  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNoteClick = (note: Note) => {
    onNoteSelect(note);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search in title, content, and tags..."
            className="w-full rounded-md border border-input bg-transparent py-2 pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No matching notes found' : 'Start typing to search'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className="w-full p-4 text-left hover:bg-muted/50"
              >
                <h3 className="font-medium">{note.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
