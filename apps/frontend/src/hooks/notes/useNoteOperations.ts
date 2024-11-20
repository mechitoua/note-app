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

  const archiveNote = useCallback(async (noteId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const archivedNote = await noteService.archiveNote(noteId);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((note) =>
          note.id === noteId ? archivedNote : note
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
    deleteNote,
  };
};
