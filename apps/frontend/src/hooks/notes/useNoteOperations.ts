import { useState, useCallback } from 'react';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/note';

interface NoteOperationsState {
  isLoading: boolean;
  error: string | null;
  notes: Note[];
}

type NoteOperationError = {
  message: string;
  code?: string;
};

export const useNoteOperations = () => {
  const [state, setState] = useState<NoteOperationsState>({
    isLoading: false,
    error: null,
    notes: [],
  });

  const handleError = (error: unknown, fallbackMessage: string): NoteOperationError => {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: fallbackMessage };
  };

  const fetchNotes = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const notes = await noteService.getNotes();
      setState(prev => ({
        ...prev,
        notes,
        isLoading: false,
      }));
    } catch (err) {
      const error = handleError(err, 'Failed to fetch notes');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  const createNote = useCallback(async (title: string, content: string, tags: string[]) => {
    const optimisticNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };

    setState(prev => ({
      ...prev,
      notes: [optimisticNote, ...prev.notes],
      isLoading: true,
      error: null,
    }));

    try {
      const newNote = await noteService.createNote({ title, content, tags });
      setState(prev => ({
        ...prev,
        notes: [newNote, ...prev.notes.filter(note => note.id !== optimisticNote.id)],
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const error = handleError(err, 'Failed to create note');
      setState(prev => ({
        ...prev,
        notes: prev.notes.filter(note => note.id !== optimisticNote.id),
        isLoading: false,
        error: error.message,
      }));
      return false;
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, title: string, content: string) => {
    const originalNotes = state.notes;
    const noteIndex = originalNotes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      setState(prev => ({
        ...prev,
        error: 'Note not found',
      }));
      return false;
    }

    const optimisticUpdate = {
      ...originalNotes[noteIndex],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note => (note.id === noteId ? optimisticUpdate : note)),
      isLoading: true,
      error: null,
    }));

    try {
      const updatedNote = await noteService.updateNote(noteId, { title, content });
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note => (note.id === noteId ? updatedNote : note)),
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const error = handleError(err, 'Failed to update note');
      setState(prev => ({
        ...prev,
        notes: originalNotes,
        isLoading: false,
        error: error.message,
      }));
      return false;
    }
  }, [state.notes]);

  const archiveNote = useCallback(async (noteId: string) => {
    const originalNotes = state.notes;
    const noteIndex = originalNotes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      setState(prev => ({
        ...prev,
        error: 'Note not found',
      }));
      return false;
    }

    const optimisticArchive = {
      ...originalNotes[noteIndex],
      archived: true,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note => (note.id === noteId ? optimisticArchive : note)),
      isLoading: true,
      error: null,
    }));

    try {
      const archivedNote = await noteService.archiveNote(noteId);
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note => (note.id === noteId ? archivedNote : note)),
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const error = handleError(err, 'Failed to archive note');
      setState(prev => ({
        ...prev,
        notes: originalNotes,
        isLoading: false,
        error: error.message,
      }));
      return false;
    }
  }, [state.notes]);

  const deleteNote = useCallback(async (noteId: string) => {
    const originalNotes = state.notes;
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId),
      isLoading: true,
      error: null,
    }));

    try {
      await noteService.deleteNote(noteId);
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const error = handleError(err, 'Failed to delete note');
      setState(prev => ({
        ...prev,
        notes: originalNotes,
        isLoading: false,
        error: error.message,
      }));
      return false;
    }
  }, [state.notes]);

  return {
    ...state,
    fetchNotes,
    createNote,
    updateNote,
    archiveNote,
    deleteNote,
  };
};
