import { useState, useCallback } from 'react';
import { Note } from '@types/note';

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Welcome to Note App",
    content: "This is your first note. You can edit or delete it.",
    tags: ["welcome"],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "How to use Markdown",
    content: "# Markdown Guide\n\nYou can write in **bold** or *italic*.\n\nMake lists:\n- Item 1\n- Item 2\n\nOr add `code` and [links](https://example.com).",
    tags: ["help", "markdown"],
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Quick Tips",
    content: "1. Click New Note to create\n2. Use tags to organize\n3. Try both editors",
    tags: ["tips"],
    createdAt: new Date().toISOString()
  }
];

interface NoteState {
  notes: Note[];
  selectedNote: Note | null;
  editorContent: {
    title: string;
    content: string;
  };
}

export const useNotes = () => {
  const [state, setState] = useState<NoteState>({
    notes: initialNotes,
    selectedNote: null,
    editorContent: {
      title: "",
      content: ""
    }
  });

  // Derived state
  const { notes, selectedNote, editorContent } = state;
  const { title: noteTitle, content: markdownContent } = editorContent;

  // Update note content in both editor and notes array
  const updateNote = useCallback((noteId: number, updates: Partial<Note>) => {
    setState(prevState => ({
      ...prevState,
      notes: prevState.notes.map(note =>
        note.id === noteId
          ? { ...note, ...updates }
          : note
      ),
      editorContent: {
        title: updates.title ?? prevState.editorContent.title,
        content: updates.content ?? prevState.editorContent.content
      }
    }));
  }, []);

  // Handle note selection
  const handleNoteClick = useCallback((note: Note) => {
    setState(prevState => ({
      ...prevState,
      selectedNote: note,
      editorContent: {
        title: note.title,
        content: note.content
      }
    }));
  }, []);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    if (!selectedNote) return;

    setState(prevState => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        content: newContent
      }
    }));
    
    updateNote(selectedNote.id, { content: newContent });
  }, [selectedNote, updateNote]);

  // Handle title changes
  const handleTitleChange = useCallback((newTitle: string) => {
    if (!selectedNote) return;

    setState(prevState => ({
      ...prevState,
      editorContent: {
        ...prevState.editorContent,
        title: newTitle
      }
    }));
    
    updateNote(selectedNote.id, { title: newTitle });
  }, [selectedNote, updateNote]);

  // Create new note
  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "",
      tags: [],
      createdAt: new Date().toISOString()
    };

    setState(prevState => ({
      notes: [newNote, ...prevState.notes],
      selectedNote: newNote,
      editorContent: {
        title: newNote.title,
        content: newNote.content
      }
    }));
  }, []);

  // Delete note
  const handleDeleteNote = useCallback((noteToDelete: Note) => {
    setState(prevState => ({
      notes: prevState.notes.filter(note => note.id !== noteToDelete.id),
      selectedNote: prevState.selectedNote?.id === noteToDelete.id ? null : prevState.selectedNote,
      editorContent: prevState.selectedNote?.id === noteToDelete.id
        ? { title: "", content: "" }
        : prevState.editorContent
    }));
  }, []);

  // Archive note (placeholder for now)
  const handleArchiveNote = useCallback((noteToArchive: Note) => {
    handleDeleteNote(noteToArchive); // Temporary implementation
  }, [handleDeleteNote]);

  return {
    notes,
    selectedNote,
    noteTitle,
    markdownContent,
    handleNoteClick,
    handleContentChange,
    handleTitleChange,
    handleArchiveNote,
    handleDeleteNote,
    handleNewNote
  };
};
