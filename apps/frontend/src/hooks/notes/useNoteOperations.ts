import { useState, useCallback } from 'react';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/note';

interface NoteOperationsState {
  isLoading: boolean;
  error: string | null;
  notes: Note[];
}

export const useNoteOperations = () => {
  const [state, setState] = useState<NoteOperationsState>({
    isLoading: false,
    error: null,
    notes: [],
  });

  const fetchNotes = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const notes = await noteService.getNotes();
      setState((prev) => ({
        ...prev,
        notes,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch notes',
      }));
    }
  }, []);

  const createNote = useCallback(async (title: string, content: string, tags: string[]) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const newNote = await noteService.createNote({ title, content, tags });
      setState((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes],
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create note',
      }));
      return false;
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, title: string, content: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const updatedNote = await noteService.updateNote(noteId, { title, content });
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((note) => 
          note.id === noteId ? updatedNote : note
        ),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update note',
      }));
      return false;
    }
  }, []);

  const updateNoteTags = useCallback(async (noteId: string, tags: string[]) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const updatedNote = await noteService.updateNoteTags(noteId, tags);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((note) => (note.id === noteId ? updatedNote : note)),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update note tags',
      }));
      return false;
    }
  }, []);

  const archiveNote = useCallback(async (noteId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const archivedNote = await noteService.archiveNote(noteId);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((note) =>
          note.id === noteId ? { ...archivedNote, archived: true } : note
        ),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to archive note',
      }));
      return false;
    }
  }, []);

  const unarchiveNote = useCallback(async (noteId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // First update localStorage
      const unarchivedNote = await noteService.unarchiveNote(noteId);
      
      // Then update state immediately
      setState((prev) => {
        // Remove the note from the current list
        const updatedNotes = prev.notes.filter(note => note.id !== noteId);
        return {
          ...prev,
          notes: updatedNotes,
          isLoading: false,
          error: null,
        };
      });
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to unarchive note',
      }));
      return false;
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await noteService.deleteNote(noteId);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== noteId),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete note',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    fetchNotes,
    createNote,
    updateNote,
    archiveNote,
    unarchiveNote,
    deleteNote,
    updateNoteTags,
  };
};
