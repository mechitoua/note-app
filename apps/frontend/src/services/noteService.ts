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

const createNote = async (noteData: { title: string; content: string; tags: string[] }): Promise<Note> => {
  try {
    const notes = await getNotes();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return newNote;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
};

const updateNote = async (noteId: string, noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const notes = await getNotes();
    const existingNoteIndex = notes.findIndex((n) => n.id === noteId);

    if (existingNoteIndex === -1) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...notes[existingNoteIndex],
      ...noteData,
      updatedAt: new Date().toISOString()
    };

    notes[existingNoteIndex] = updatedNote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return updatedNote;
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

const archiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = await getNotes();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      archived: true,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return updatedNote;
  } catch (error) {
    console.error('Error archiving note:', error);
    throw new Error('Failed to archive note');
  }
};

const unarchiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = await getNotes();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      archived: false,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return updatedNote;
  } catch (error) {
    console.error('Error unarchiving note:', error);
    throw new Error('Failed to unarchive note');
  }
};

export const noteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
};
