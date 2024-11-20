import { Note } from '@/types/note';

const STORAGE_KEY = 'notes';

const getNotes = async (): Promise<Note[]> => {
  try {
    const notesJson = localStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

const createNote = async (note: Note): Promise<Note> => {
  try {
    const notes = await getNotes();
    notes.unshift(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
};

const updateNote = async (note: Note): Promise<Note> => {
  try {
    const notes = await getNotes();
    const existingNoteIndex = notes.findIndex((n) => n.id === note.id);

    if (existingNoteIndex === -1) {
      throw new Error('Note not found');
    }

    notes[existingNoteIndex] = note;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return note;
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
};

const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notes = await getNotes();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

const archiveNote = async (noteId: number): Promise<void> => {
  try {
    const notes = await getNotes();
    const noteToArchive = notes.find((note) => note.id === noteId);
    if (noteToArchive) {
      noteToArchive.archived = true;
      await updateNote(noteToArchive);
    }
  } catch (error) {
    console.error('Error archiving note:', error);
    throw new Error('Failed to archive note');
  }
};

const unarchiveNote = async (noteId: number): Promise<void> => {
  try {
    const notes = await getNotes();
    const noteToUnarchive = notes.find((note) => note.id === noteId);
    if (noteToUnarchive) {
      noteToUnarchive.archived = false;
      await updateNote(noteToUnarchive);
    }
  } catch (error) {
    console.error('Error unarchiving note:', error);
    throw new Error('Failed to unarchive note');
  }
};

export const noteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote: deleteNote,
  archiveNote,
  unarchiveNote,
};
