import { Note } from '@/types/note';
import { useState } from 'react';

export interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  editorContent: {
    title: string;
    content: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  editorContent: {
    title: '',
    content: '',
  },
  isLoading: false,
  error: null,
};

export const useNotesState = () => {
  const [state, setState] = useState<NotesState>(initialState);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  const setNotes = (notes: Note[]) => {
    setState(prev => ({ ...prev, notes }));
  };

  const setSelectedNote = (note: Note | null) => {
    setState(prev => ({
      ...prev,
      selectedNote: note,
      editorContent: note
        ? { title: note.title, content: note.content }
        : { title: '', content: '' },
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const updateEditorContent = (content: Partial<{ title: string; content: string }>) => {
    setState(prev => ({
      ...prev,
      editorContent: { ...prev.editorContent, ...content },
    }));
  };

  const clearEditor = () => {
    setState(prev => ({
      ...prev,
      selectedNote: null,
      editorContent: { title: '', content: '' },
    }));
  };

  return {
    state,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    setNotes,
    setSelectedNote,
    setLoading,
    setError,
    updateEditorContent,
    clearEditor,
  };
};
