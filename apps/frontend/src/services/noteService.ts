import { Note } from '@/types/note';

const STORAGE_KEY = 'notes';

class NoteServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'NoteServiceError';
  }
}

const getStorageData = (): Note[] => {
  try {
    const notesJson = localStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error parsing notes from storage:', error);
    return [];
  }
};

const setStorageData = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    throw new NoteServiceError('Failed to save notes to storage');
  }
};

const getNotes = async (): Promise<Note[]> => {
  try {
    return getStorageData();
  } catch (error) {
    console.error('Error loading notes:', error);
    throw new NoteServiceError('Failed to load notes');
  }
};

const createNote = async (noteData: { title: string; content: string; tags: string[] }): Promise<Note> => {
  try {
    const notes = getStorageData();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      tags: [...new Set(noteData.tags.map(tag => tag.trim()))], // Remove duplicates and trim
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    
    notes.unshift(newNote);
    setStorageData(notes);
    return newNote;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new NoteServiceError('Failed to create note');
  }
};

const updateNote = async (noteId: string, noteData: { title: string; content: string }): Promise<Note> => {
  try {
    const notes = getStorageData();
    const existingNoteIndex = notes.findIndex((n) => n.id === noteId);

    if (existingNoteIndex === -1) {
      throw new NoteServiceError('Note not found', 'NOT_FOUND');
    }

    const updatedNote: Note = {
      ...notes[existingNoteIndex],
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      updatedAt: new Date().toISOString()
    };

    notes[existingNoteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error updating note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to update note');
  }
};

const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found', 'NOT_FOUND');
    }
    
    notes.splice(noteIndex, 1);
    setStorageData(notes);
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to delete note');
  }
};

const archiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found', 'NOT_FOUND');
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      archived: true,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error archiving note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to archive note');
  }
};

const unarchiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found', 'NOT_FOUND');
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      archived: false,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error unarchiving note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to unarchive note');
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
