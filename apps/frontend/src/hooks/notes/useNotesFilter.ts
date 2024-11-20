import { Note } from '@/types/note';
import { useCallback, useState } from 'react';

export const useNotesFilter = (notes: Note[]) => {
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filterByArchiveStatus = useCallback(
    (notes: Note[]) => {
      return notes.filter((note) => note.archived === showArchived);
    },
    [showArchived]
  );

  const filterBySearchTerm = useCallback(
    (notes: Note[]) => {
      if (!searchTerm) return notes;
      const term = searchTerm.toLowerCase();
      return notes.filter(
        (note) =>
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term) ||
          note.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    },
    [searchTerm]
  );

  const filterByTag = useCallback(
    (notes: Note[]) => {
      if (!selectedTag) return notes;
      return notes.filter((note) =>
        note.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    },
    [selectedTag]
  );

  const getFilteredNotes = useCallback(() => {
    let filtered = filterByArchiveStatus(notes);
    filtered = filterBySearchTerm(filtered);
    filtered = filterByTag(filtered);
    return filtered;
  }, [notes, filterByArchiveStatus, filterBySearchTerm, filterByTag]);

  return {
    showArchived,
    setShowArchived,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    getFilteredNotes,
  };
};