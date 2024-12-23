import { noteService } from '@/services/noteService';
import { Note } from '@/types/note';
import { useCallback } from 'react';
import { useNotesState } from './useNotesState';

export const useNotesCrud = () => {
  const {
    state,
    setNotes,
    setSelectedNote,
    setLoading,
    setError,
    clearEditor,
    setIsAddNoteModalOpen,
  } = useNotesState();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const notes = await noteService.getNotes();
      setNotes(notes);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [setNotes, setError, setLoading]);

  const createNote = useCallback(
    async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      try {
        const newNote = await noteService.createNote({ title, content, tags });
        setNotes([newNote, ...state.notes]);
        setSelectedNote(newNote); // This will update both selectedNote and editorContent
        setError(null);
        setIsAddNoteModalOpen(false);
      } catch (err) {
        setError('Failed to create note');
      }
    },
    [state.notes, setNotes, setSelectedNote, setError, setIsAddNoteModalOpen]
  );

  const updateNote = useCallback(
    async (noteToUpdate: Note) => {
      try {
        const updatedNote = {
          ...noteToUpdate,
          updatedAt: new Date().toISOString(),
        };
        await noteService.updateNote(noteToUpdate.id, updatedNote);
        setNotes(state.notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
        clearEditor();
        setError(null);
      } catch (err) {
        setError('Failed to update note');
      }
    },
    [state.notes, setNotes, clearEditor, setError]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        await noteService.deleteNote(noteId);
        setNotes(state.notes.filter(note => note.id !== noteId));
        clearEditor();
        setError(null);
      } catch (err) {
        setError('Failed to delete note');
      }
    },
    [state.notes, setNotes, clearEditor, setError]
  );

  const archiveNote = useCallback(
    async (noteId: string) => {
      const noteToArchive = state.notes.find(note => note.id === noteId);
      if (!noteToArchive) return;

      try {
        const updatedNote = {
          ...noteToArchive,
          archived: !noteToArchive.archived,
          updatedAt: new Date().toISOString(),
        };
        await noteService.updateNote(noteToArchive.id, updatedNote);
        setNotes(state.notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
        clearEditor();
        setError(null);
      } catch (err) {
        setError('Failed to archive note');
      }
    },
    [state.notes, setNotes, clearEditor, setError]
  );

  const unarchiveNote = useCallback(
    async (noteId: string) => {
      const noteToUnarchive = state.notes.find(note => note.id === noteId);
      if (!noteToUnarchive) return false;

      try {
        const updatedNote = {
          ...noteToUnarchive,
          archived: false,
          updatedAt: new Date().toISOString(),
        };
        await noteService.updateNote(noteToUnarchive.id, updatedNote);
        setNotes(state.notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
        clearEditor();
        setError(null);
        return true;
      } catch (err) {
        setError('Failed to unarchive note');
        return false;
      }
    },
    [state.notes, setNotes, clearEditor, setError]
  );

  return {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  };
};
