import { Note } from '@/types/note';
import { noteService } from '@/services/noteService';
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
  const handleNewNote = useCallback(async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
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
        error: null,
      }));
      setIsAddNoteModalOpen(false);
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to create note',
      }));
    }
  }, []);

  // Archive note
  const handleArchiveNote = useCallback(async (noteId: string) => {
    try {
      const noteToArchive = state.notes.find((note) => note.id === noteId);
      if (!noteToArchive) return;

      const archivedNote = { ...noteToArchive, archived: true };
      await noteService.updateNote(archivedNote);

      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.map((note) =>
          note.id === noteId ? archivedNote : note
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
  }, [state.notes]);

  // Delete note
  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      await noteService.deleteNote(noteId);
      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.filter((note) => note.id !== noteId),
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
  }, []);

  return {
    notes: state.notes,
    selectedNote: state.selectedNote,
    editorContent: state.editorContent,
    isLoading: state.isLoading,
    error: state.error,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    clearSelectedNote,
    handleNewNote,
    handleArchiveNote,
    handleDeleteNote,
  };
};
