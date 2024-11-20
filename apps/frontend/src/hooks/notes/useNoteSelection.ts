import { useState, useCallback } from 'react';
import { Note } from '@/types/note';

interface NoteSelection {
  selectedNote: Note | null;
  editorContent: {
    title: string;
    content: string;
  };
}

export const useNoteSelection = () => {
  const [selection, setSelection] = useState<NoteSelection>({
    selectedNote: null,
    editorContent: {
      title: '',
      content: '',
    },
  });

  const handleNoteSelect = useCallback((note: Note) => {
    setSelection({
      selectedNote: note,
      editorContent: {
        title: note.title,
        content: note.content,
      },
    });
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setSelection((prev) => ({
      ...prev,
      editorContent: {
        ...prev.editorContent,
        content,
      },
    }));
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setSelection((prev) => ({
      ...prev,
      editorContent: {
        ...prev.editorContent,
        title,
      },
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setSelection({
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
    });
  }, []);

  return {
    ...selection,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    clearSelection,
  };
};
