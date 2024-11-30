import { CurrentView, Note } from '@/types';
import { Search, X } from 'lucide-react';
import { MobileHeader } from './MobileHeader';

interface MobileSearchViewProps {
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: CurrentView) => void;
  onNoteSelect: (note: Note) => void;
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
}

export const MobileSearchView = ({
  notes,
  searchQuery,
  onSearchChange,
  onNavigate,
  onNoteSelect,
  tags,
  selectedTag,
  onTagSelect,
}: MobileSearchViewProps) => {
  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (selectedTag && note.tags.includes(selectedTag))
  );

  const handleNoteClick = (note: Note) => {
    onNoteSelect(note);
  };

  return (
    <div className="flex h-full flex-col">
      <MobileHeader title="Search" />
      <div className="border-b border-border p-4 space-y-4">
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
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag)}
                className={`rounded-md px-2 py-1 text-xs ${
                  selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'No matching notes found' : 'Start typing to search'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => handleNoteClick(note)}
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
                            className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
