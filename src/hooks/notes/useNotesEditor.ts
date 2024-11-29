import { Note } from '@/types/note';
import { useCallback } from 'react';
import { useNotesCrud } from './useNotesCrud';
import { useNotesState } from './useNotesState';

export const useNotesEditor = () => {
  const { state, setSelectedNote, updateEditorContent, clearEditor } = useNotesState();

  const { updateNote } = useNotesCrud();

  const handleNoteSelect = useCallback(
    (note: Note) => {
      setSelectedNote(note);
    },
    [setSelectedNote]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      updateEditorContent({ content });
    },
    [updateEditorContent]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      updateEditorContent({ title });
    },
    [updateEditorContent]
  );

  const handleSaveNote = useCallback(async () => {
    if (!state.selectedNote) return;

    const updatedNote = {
      ...state.selectedNote,
      title: state.editorContent.title || 'Untitled Note',
      content: state.editorContent.content,
    };

    await updateNote(updatedNote);
  }, [state.selectedNote, state.editorContent, updateNote]);

  const clearSelection = useCallback(() => {
    setSelectedNote(null);
  }, [setSelectedNote]);

  const handleCancelEdit = useCallback(() => {
    clearEditor();
  }, [clearEditor]);

  return {
    selectedNote: state.selectedNote,
    editorContent: state.editorContent,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    clearSelection,
  };
};
