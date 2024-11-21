import { useState, useCallback, useMemo } from 'react';
import { Note } from '@/types/note';

interface EditorContent {
  title: string;
  content: string;
}

interface NoteSelection {
  selectedNote: Note | null;
  editorContent: EditorContent;
}

const DEFAULT_SELECTION: NoteSelection = {
  selectedNote: null,
  editorContent: {
    title: '',
    content: '',
  },
};

export const useNoteSelection = () => {
  const [selection, setSelection] = useState<NoteSelection>(DEFAULT_SELECTION);

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
    setSelection(DEFAULT_SELECTION);
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    if (!selection.selectedNote) return false;
    
    return (
      selection.editorContent.title !== selection.selectedNote.title ||
      selection.editorContent.content !== selection.selectedNote.content
    );
  }, [selection.selectedNote, selection.editorContent]);

  return {
    ...selection,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    clearSelection,
    hasUnsavedChanges,
  };
};
