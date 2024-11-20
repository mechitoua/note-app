import { noteService } from '@/services/noteService';
import { Note } from '@/types/note';
import { useCallback, useEffect, useState } from 'react';

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  editorContent: {
    title: string;
    content: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  selectedNote: null,
  editorContent: {
    title: '',
    content: '',
  },
  isLoading: false,
  error: null,
};

export const useNotes = () => {
  const [state, setState] = useState<NoteState>(initialState);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const notes = await noteService.getNotes();
        setState((prev) => ({
          ...prev,
          notes,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch notes',
        }));
      }
    };

    fetchNotes();
  }, []);

  // Handle note selection
  const handleNoteSelect = useCallback((note: Note) => {
    setState((prevState) => ({
      ...prevState,
      selectedNote: note,
      editorContent: {
        title: note.title,
        content: note.content,
      },
    }));
  }, []);

  // Handle content change
  const handleContentChange = useCallback((content: string) => {
    setState((prevState) => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        content,
      },
    }));
  }, []);

  // Handle title change
  const handleTitleChange = useCallback((title: string) => {
    setState((prevState) => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        title,
      },
    }));
  }, []);

  // Handle save note
  const handleSaveNote = useCallback(async () => {
    if (!state.selectedNote) return;

    const updatedNote = {
      ...state.selectedNote,
      title: state.editorContent.title,
      content: state.editorContent.content,
      updatedAt: new Date().toISOString(),
    };

    try {
      await noteService.updateNote(updatedNote);
      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.map((note) =>
          note.id === state.selectedNote?.id ? updatedNote : note
        ),
        selectedNote: null,
        editorContent: {
          title: '',
          content: '',
        },
        error: null,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to save note',
      }));
    }
  }, [state.selectedNote, state.editorContent]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
    }));
  }, []);

  // Clear selected note
  const clearSelectedNote = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
    }));
  }, []);

  // Create new note
  const handleNewNote = useCallback(
    async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      try {
        const newNote = {
          id: crypto.randomUUID(),
          title,
          content,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archived: false,
        };

        await noteService.createNote(newNote);
        setState((prevState) => ({
          ...prevState,
          notes: [newNote, ...prevState.notes],
          selectedNote: newNote,
          editorContent: {
            title: newNote.title,
            content: newNote.content,
          },
          error: null,
        }));
        setIsAddNoteModalOpen(false);
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          error: 'Failed to create note',
        }));
      }
    },
    []
  );

  // Archive note
  const handleArchiveNote = useCallback(async () => {
    if (!state.selectedNote) return;

    try {
      const updatedNote = {
        ...state.selectedNote,
        archived: !state.selectedNote.archived,
        updatedAt: new Date().toISOString(),
      };
      await noteService.updateNote(updatedNote);

      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.map((note) =>
          note.id === state.selectedNote?.id ? updatedNote : note
        ),
        selectedNote: null,
        editorContent: {
          title: '',
          content: '',
        },
        error: null,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to archive note',
      }));
    }
  }, [state.selectedNote]);

  // Get filtered notes based on archive status and search/tag filters
  const getFilteredNotes = useCallback((archived: boolean = false) => {
    return state.notes.filter((note) => note.archived === archived);
  }, [state.notes]);

  // Handle delete note
  const handleDeleteNote = useCallback(async () => {
    if (!state.selectedNote) return;

    try {
      await noteService.deleteNote(state.selectedNote.id);
      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.filter((note) => note.id !== state.selectedNote?.id),
        selectedNote: null,
        editorContent: {
          title: '',
          content: '',
        },
        error: null,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to delete note',
      }));
    }
  }, [state.selectedNote]);

  return {
    notes: state.notes,
    selectedNote: state.selectedNote,
    editorContent: state.editorContent,
    isLoading: state.isLoading,
    error: state.error,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    handleNewNote,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    handleArchiveNote,
    handleDeleteNote,
    clearSelectedNote,
    getFilteredNotes,
  };
};
