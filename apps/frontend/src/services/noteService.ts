import { Note } from '@/types/note';

const STORAGE_KEY = 'notes';

// Error types
export type NoteServiceErrorType = 
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'STORAGE_ERROR'
  | 'DUPLICATE_ERROR'
  | 'PERMISSION_ERROR';

export class NoteServiceError extends Error {
  constructor(
    message: string,
    public type: NoteServiceErrorType = 'STORAGE_ERROR',
    public details?: Record<string, any>
  ) {
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

const validateNote = (note: Partial<Note>): void => {
  if (!note.title?.trim()) {
    throw new NoteServiceError(
      'Note title cannot be empty',
      'VALIDATION_ERROR',
      { field: 'title' }
    );
  }
  if (!note.content?.trim()) {
    throw new NoteServiceError(
      'Note content cannot be empty',
      'VALIDATION_ERROR',
      { field: 'content' }
    );
  }
};

const createNote = async (noteData: { title: string; content: string; tags: string[] }): Promise<Note> => {
  try {
    validateNote(noteData);
    
    const notes = getStorageData();

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };

    notes.unshift(newNote);
    setStorageData(notes);
    return newNote;
  } catch (error) {
    console.error('Error creating note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to create note due to storage error');
  }
};

const updateNote = async (noteId: string, noteData: { title: string; content: string }): Promise<Note> => {
  try {
    validateNote(noteData);
    
    const notes = getStorageData();
    const existingNoteIndex = notes.findIndex((n) => n.id === noteId);

    if (existingNoteIndex === -1) {
      throw new NoteServiceError(
        `Note with ID "${noteId}" not found`,
        'NOT_FOUND'
      );
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
    throw new NoteServiceError('Failed to update note due to storage error');
  }
};

const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError(
        `Cannot delete note: Note with ID "${noteId}" not found`,
        'NOT_FOUND'
      );
    }
    
    notes.splice(noteIndex, 1);
    setStorageData(notes);
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error instanceof NoteServiceError) {
      throw error;
    }
    throw new NoteServiceError('Failed to delete note due to storage error');
  }
};

const archiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError(
        `Cannot archive note: Note with ID "${noteId}" not found`,
        'NOT_FOUND'
      );
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
    throw new NoteServiceError('Failed to archive note due to storage error');
  }
};

const unarchiveNote = async (noteId: string): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new NoteServiceError(
        `Cannot unarchive note: Note with ID "${noteId}" not found`,
        'NOT_FOUND'
      );
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
    throw new NoteServiceError('Failed to unarchive note due to storage error');
  }
};

const updateNoteTags = async (noteId: string, tags: string[]): Promise<Note> => {
  try {
    const notes = getStorageData();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      throw new NoteServiceError('Note not found', 'NOT_FOUND');
    }

    const updatedNote = {
      ...notes[noteIndex],
      tags: tags.map(tag => tag.trim()),
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
