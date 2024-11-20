import { useEffect } from 'react';
import { useNotesState } from './useNotesState';
import { useNotesCrud } from './useNotesCrud';
import { useNotesFilter } from './useNotesFilter';
import { useNotesEditor } from './useNotesEditor';

export const useNotes = () => {
  const {
    state,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
  } = useNotesState();

  const {
    fetchNotes,
    createNote,
    deleteNote,
    archiveNote,
  } = useNotesCrud();

  const {
    showArchived,
    setShowArchived,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    getFilteredNotes,
  } = useNotesFilter(state.notes);

  const {
    selectedNote,
    editorContent,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
  } = useNotesEditor();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    // State
    notes: state.notes,
    filteredNotes: getFilteredNotes(),
    selectedNote,
    editorContent,
    isLoading: state.isLoading,
    error: state.error,
    isAddNoteModalOpen,

    // Modal
    setIsAddNoteModalOpen,

    // CRUD Operations
    handleNewNote: createNote,
    handleDeleteNote: deleteNote,
    handleArchiveNote: archiveNote,

    // Editor
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,

    // Filters
    showArchived,
    setShowArchived,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
  };
};
