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
  isLoading: true,
  error: null,
};

export const useNotes = () => {
  const [state, setState] = useState<NoteState>(initialState);

  // Derived state
  const { notes, selectedNote, editorContent, isLoading, error } = state;
  const { title: noteTitle, content: markdownContent } = editorContent;

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const loadedNotes = await noteService.getNotes();
        setState((prev) => ({ ...prev, notes: loadedNotes, isLoading: false }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: 'Failed to load notes',
          isLoading: false,
        }));
      }
    };

    loadNotes();
  }, []);

  // Handle note selection
  const handleNoteClick = useCallback((note: Note) => {
    setState((prevState) => ({
      ...prevState,
      selectedNote: note,
      editorContent: {
        title: note.title,
        content: note.content,
      },
      error: null,
    }));
  }, []);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setState((prevState) => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        content: newContent,
      },
    }));
  }, []);

  // Handle title changes
  const handleTitleChange = useCallback((newTitle: string) => {
    setState((prevState) => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        title: newTitle,
      },
    }));
  }, []);

  // Save note changes
  const handleSaveNote = useCallback(async () => {
    if (!selectedNote) return;

    try {
      const updatedNote = await noteService.saveNote({
        ...selectedNote,
        title: editorContent.title,
        content: editorContent.content,
      });

      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.map((note) =>
          note.id === selectedNote.id ? updatedNote : note
        ),
        selectedNote: updatedNote,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to save note',
      }));
    }
  }, [selectedNote, editorContent]);

  // Create new note
  const handleNewNote = useCallback(async () => {
    try {
      const newNote: Note = {
        id: Date.now(),
        title: 'New Note',
        content: '',
        tags: ['Personal', 'Draft'],  
        createdAt: new Date().toISOString(),
      };

      const savedNote = await noteService.saveNote(newNote);

      setState((prevState) => ({
        ...prevState,
        notes: [savedNote, ...prevState.notes],
        selectedNote: savedNote,
        editorContent: {
          title: savedNote.title,
          content: savedNote.content,
        },
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to create new note',
      }));
    }
  }, []);

  // Delete note
  const handleDeleteNote = useCallback(async (noteToDelete: Note) => {
    try {
      await noteService.deleteNote(noteToDelete.id);

      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.filter((note) => note.id !== noteToDelete.id),
        selectedNote: prevState.selectedNote?.id === noteToDelete.id ? null : prevState.selectedNote,
        editorContent:
          prevState.selectedNote?.id === noteToDelete.id
            ? { title: '', content: '' }
            : prevState.editorContent,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to delete note',
      }));
    }
  }, []);

  // Archive note
  const handleArchiveNote = useCallback(async (noteToArchive: Note) => {
    try {
      await noteService.archiveNote(noteToArchive.id);

      setState((prevState) => ({
        ...prevState,
        notes: prevState.notes.filter((note) => note.id !== noteToArchive.id),
        selectedNote: null,
        editorContent: { title: '', content: '' },
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to archive note',
      }));
    }
  }, []);

  return {
    notes,
    selectedNote,
    isLoading,
    error,
    noteTitle,
    markdownContent,
    handleNewNote,
    handleDeleteNote,
    handleArchiveNote,
    handleNoteClick,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
  };
};
