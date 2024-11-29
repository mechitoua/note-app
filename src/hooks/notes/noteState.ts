import { Dispatch, SetStateAction } from 'react';
import { Note } from '@/types/note';
import { NoteState } from './types';

export const updateNoteInState = (notes: Note[], updatedNote: Note): Note[] => {
  return notes.map(note => (note.id === updatedNote.id ? updatedNote : note));
};

export const clearEditorContent = (setState: Dispatch<SetStateAction<NoteState>>) => {
  setState(prevState => ({
    ...prevState,
    selectedNote: null,
    editorContent: {
      title: '',
      content: '',
    },
  }));
};

export const setError = (setState: Dispatch<SetStateAction<NoteState>>, error: string) => {
  setState(prevState => ({
    ...prevState,
    error,
  }));
};

export const setLoading = (setState: Dispatch<SetStateAction<NoteState>>, isLoading: boolean) => {
  setState(prevState => ({
    ...prevState,
    isLoading,
  }));
};
