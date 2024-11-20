import { useState, useEffect } from 'react';
import { useNoteSelection } from './notes/useNoteSelection';
import { useNoteOperations } from './notes/useNoteOperations';
import { Note } from '@/types/note';

export const useNotes = () => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  
  const {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    archiveNote,
    deleteNote,
  } = useNoteOperations();

  const {
    selectedNote,
    editorContent,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    clearSelection,
  } = useNoteSelection();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNewNote = async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
    const success = await createNote(title, content, tags);
    if (success) {
      setIsAddNoteModalOpen(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    const success = await updateNote(selectedNote.id, editorContent.title, editorContent.content);
    if (success) {
      clearSelection();
    }
  };

  const handleArchiveNote = async () => {
    if (!selectedNote) return;
    const success = await archiveNote(selectedNote.id);
    if (success) {
      clearSelection();
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    const success = await deleteNote(selectedNote.id);
    if (success) {
      clearSelection();
    }
  };

  const getFilteredNotes = (archived: boolean) => {
    return notes.filter(note => note.archived === archived);
  };

  return {
    notes,
    selectedNote,
    editorContent,
    isLoading,
    error,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    handleNewNote,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleArchiveNote,
    handleDeleteNote,
    clearSelectedNote: clearSelection,
    getFilteredNotes,
  };
};
