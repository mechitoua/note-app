import { useState, useEffect, useCallback } from 'react';
import { useNoteSelection } from '@hooks/notes/useNoteSelection';
import { useNoteOperations } from '@hooks/notes/useNoteOperations';
import { Note } from '@/types/note';

export const useNotes = () => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const {
    selectedNote,
    editorContent,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    clearSelection,
    hasUnsavedChanges,
  } = useNoteSelection();

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

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNewNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    const success = await createNote(noteData.title, noteData.content, noteData.tags);
    if (success) {
      setIsAddNoteModalOpen(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote || !hasUnsavedChanges) return;
    
    const success = await updateNote(selectedNote.id, editorContent.title, editorContent.content);
    if (success) {
      clearSelection();
    }
  };

  const handleCancelEdit = () => {
    clearSelection();
  };

  const getFilteredNotes = useCallback(() => {
    return notes
      .filter(note => note.archived === showArchived)
      .filter(note => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
        );
      })
      .filter(note => {
        if (!selectedTag) return true;
        return note.tags.some(tag => 
          tag.toLowerCase() === selectedTag.toLowerCase()
        );
      });
  }, [notes, showArchived, searchTerm, selectedTag]);

  return {
    // State
    notes,
    selectedNote,
    editorContent,
    isLoading,
    error,
    isAddNoteModalOpen,
    hasUnsavedChanges,

    // Modal
    setIsAddNoteModalOpen,

    // CRUD Operations
    handleNewNote,
    handleDeleteNote: deleteNote,
    handleArchiveNote: archiveNote,
    handleSaveNote,

    // Editor
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleCancelEdit,

    // Filters
    showArchived,
    setShowArchived,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    getFilteredNotes,
  };
};
