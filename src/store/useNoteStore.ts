import { EditorContent } from '@/types/editor';
import { Note } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NoteStore {
  // State
  notes: Note[];
  selectedNote: Note | null;
  editorContent: EditorContent | null;
  currentView: 'all-notes' | 'archived';
  selectedTag: string | null;
  searchQuery: string;
  tags: string[];
  isLoading: boolean;
  error: string | null;
  isAddNoteModalOpen: boolean;

  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  setSelectedNote: (note: Note | null) => void;
  updateEditorContent: (content: Partial<EditorContent>) => void;
  setCurrentView: (view: 'all-notes' | 'archived') => void;
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsAddNoteModalOpen: (isOpen: boolean) => void;
  syncTags: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: [],
      selectedNote: null,
      editorContent: null,
      currentView: 'all-notes',
      selectedTag: null,
      searchQuery: '',
      tags: [],
      isLoading: false,
      error: null,
      isAddNoteModalOpen: false,

      // Actions
      setNotes: notes => {
        set({ notes });
        get().syncTags();
      },

      addNote: note => {
        set(state => {
          // Reset search and tag filters when adding a new note
          // This ensures the new note is visible
          return {
            notes: [note, ...state.notes],
            searchQuery: '',
            selectedTag: null,
          };
        });
        get().syncTags();
      },

      updateNote: updatedNote => {
        set(state => {
          const notes = state.notes.map(note =>
            note.id === updatedNote.id ? { ...note, ...updatedNote } : note
          );
          return { notes };
        });
        get().syncTags();
      },

      deleteNote: noteId => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== noteId),
          selectedNote: state.selectedNote?.id === noteId ? null : state.selectedNote,
        }));
        get().syncTags();
      },

      setSelectedNote: note => {
        set({
          selectedNote: note,
          editorContent: note
            ? {
                title: note.title,
                content: note.content,
                tags: note.tags,
              }
            : null,
        });
      },

      updateEditorContent: content => {
        set(state => ({
          editorContent: state.editorContent
            ? { ...state.editorContent, ...content }
            : { title: '', content: '', tags: [], ...content },
        }));
      },

      setCurrentView: view => {
        set({ currentView: view });
      },

      setSelectedTag: tag => {
        set({ selectedTag: tag });
      },

      setSearchQuery: query => {
        set({ searchQuery: query });
      },

      setIsAddNoteModalOpen: isOpen => {
        set({ isAddNoteModalOpen: isOpen });
      },

      syncTags: () => {
        const allTags = new Set<string>();
        get().notes.forEach(note => {
          note.tags.forEach(tag => allTags.add(tag));
        });
        set({ tags: Array.from(allTags).sort() });
      },
    }),
    {
      name: 'note-store',
      partialize: state => ({
        notes: state.notes,
        tags: state.tags,
      }),
    }
  )
);
