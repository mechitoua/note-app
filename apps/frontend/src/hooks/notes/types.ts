import { Note } from '@/types/note';

export interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  editorContent: {
    title: string;
    content: string;
  };
  isLoading: boolean;
  error: string | null;
}

export const initialState: NoteState = {
  notes: [],
  selectedNote: null,
  editorContent: {
    title: '',
    content: '',
  },
  isLoading: false,
  error: null,
};
