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
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const notes = JSON.parse(data);
    // Migrate old notes that use isArchived to archived
    return notes.map((note: any) => ({
      ...note,
      archived: note.archived ?? note.isArchived ?? false,
    }));
  } catch (error) {
    console.error('Error reading from localStorage:', error);
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
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found');
    }

    const updatedNote = {
      ...notes[noteIndex],
      archived: true,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error archiving note:', error);
    throw new NoteServiceError('Failed to archive note');
  }
};

const unarchiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found');
    }

    const updatedNote = {
      ...notes[noteIndex],
      archived: false,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error unarchiving note:', error);
    throw new NoteServiceError('Failed to unarchive note');
  }
};

const updateNoteTags = async (noteId: string, tags: string[]): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found');
    }

    const existingTags = notes[noteIndex].tags || [];
    const updatedNote = {
      ...notes[noteIndex],
      tags: [...new Set([...existingTags, ...tags.map(tag => tag.trim())])],
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    setStorageData(notes);
    return updatedNote;
  } catch (error) {
    console.error('Error updating note tags:', error);
    throw new NoteServiceError('Failed to update note tags');
  }
};

export const noteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  updateNoteTags,
};
