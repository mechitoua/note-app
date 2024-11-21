import { useEffect, useState } from 'react';
import { useNoteOperations } from './notes/useNoteOperations';
import { useNoteSelection } from './notes/useNoteSelection';

export const useNotes = () => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  const {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    updateNoteTags,
    archiveNote,
    unarchiveNote,
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

  const handleNewNote = async ({
    title,
    content,
    tags,
  }: {
    title: string;
    content: string;
    tags: string[];
  }) => {
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

  const handleUnarchiveNote = async (noteId: string) => {
    const success = await unarchiveNote(noteId);
    if (success) {
      clearSelection();
      // Force a refresh of notes
      await fetchNotes();
    }
    return success;
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    const success = await deleteNote(selectedNote.id);
    if (success) {
      clearSelection();
    }
  };

  const handleCancelEdit = () => {
    // Clear selection which will close the editor and reset content
    clearSelection();
  };

  const handleAddTags = async (tags: string[]) => {
    if (!selectedNote) return;
    
    // Update note tags with the new tag list
    const success = await updateNoteTags(selectedNote.id, tags);
    if (success) {
      // Refresh notes to ensure consistency
      await fetchNotes();
      // Sync tags with the store to update sidebar
      syncTags(await noteService.getNotes());
    }
  };

  const handleUpdateNoteTags = async (noteId: string, tags: string[]) => {
    const success = await updateNoteTags(noteId, tags);
    if (success) {
      // Update the selected note if it's the one being modified
      if (selectedNote?.id === noteId) {
        const updatedNote = await noteService
          .getNotes()
          .then((notes) => notes.find((note) => note.id === noteId));
        if (updatedNote) {
          setSelectedNote(updatedNote);
        }
      }
    }
    return success;
  };

  const getFilteredNotes = (archived: boolean) => {
    return notes.filter((note) => note.archived === archived);
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
    handleUnarchiveNote,
    handleDeleteNote,
    handleCancelEdit,
    clearSelectedNote: clearSelection,
    getFilteredNotes,
    fetchNotes,
    handleAddTags,
    handleUpdateNoteTags,
  };
};
