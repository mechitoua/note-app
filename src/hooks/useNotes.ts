import { useFeedback } from '@/contexts/FeedbackContext';
import { noteService, NoteServiceError } from '@/services/noteService';
import { useCallback, useEffect, useState } from 'react';
import { useNoteOperations } from './notes/useNoteOperations';
import { useNoteSelection } from './notes/useNoteSelection';
import { useTags } from './useTags';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof NoteServiceError) {
    switch (error.type) {
      case 'NOT_FOUND':
        return error.message;
      case 'VALIDATION_ERROR':
        return `Validation error: ${error.message}`;
      case 'DUPLICATE_ERROR':
        return error.message;
      case 'STORAGE_ERROR':
        return 'There was a problem saving your changes. Please try again.';
      case 'PERMISSION_ERROR':
        return 'You do not have permission to perform this action.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

export const useNotes = () => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const { showSuccess, showError } = useFeedback();

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
    setSelection,
  } = useNoteSelection();

  const { syncTags } = useTags();

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
    try {
      const success = await createNote(title, content, tags);
      if (success) {
        showSuccess('Note created successfully');
        setIsAddNoteModalOpen(false);
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    try {
      const success = await updateNote(selectedNote.id, editorContent.title, editorContent.content);
      if (success) {
        showSuccess('Note updated successfully');
        clearSelection();
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleArchiveNote = async () => {
    if (!selectedNote) return;
    try {
      const success = await archiveNote(selectedNote.id);
      if (success) {
        showSuccess(
          selectedNote.archived ? 'Note unarchived successfully' : 'Note archived successfully'
        );
        clearSelection();
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleUnarchiveNote = useCallback(
    async (noteId: string) => {
      try {
        const success = await unarchiveNote(noteId);
        if (success) {
          showSuccess('Note unarchived successfully');
          clearSelection();
          await fetchNotes();
        }
        return success;
      } catch (error) {
        showError(getErrorMessage(error));
        return false;
      }
    },
    [unarchiveNote, clearSelection, fetchNotes, showSuccess, showError]
  );

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    try {
      const success = await deleteNote(selectedNote.id);
      if (success) {
        showSuccess('Note deleted successfully');
        clearSelection();
      }
    } catch (error) {
      showError(getErrorMessage(error));
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
    try {
      const success = await updateNoteTags(noteId, tags);
      if (success) {
        showSuccess('Tags updated successfully');
        if (selectedNote?.id === noteId) {
          const updatedNote = await noteService
            .getNotes()
            .then(notes => notes.find(note => note.id === noteId));
          if (updatedNote) {
            setSelection({
              selectedNote: updatedNote,
              editorContent: {
                title: updatedNote.title,
                content: updatedNote.content,
              },
            });
          }
        }
      } else {
        showError('Failed to update tags');
      }
      return success;
    } catch (error) {
      showError(getErrorMessage(error));
      return false;
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
