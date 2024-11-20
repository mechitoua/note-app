import { Dispatch, SetStateAction } from 'react';
import { Note } from '@/types/note';
import { noteService } from '@/services/noteService';
import { NoteState } from './types';
import { clearEditorContent, setError, updateNoteInState } from './noteState';

export const createNote = async (
  setState: Dispatch<SetStateAction<NoteState>>,
  title: string,
  content: string,
  tags: string[]
) => {
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

    return true;
  } catch (err) {
    setError(setState, 'Failed to create note');
    return false;
  }
};

export const updateNote = async (
  setState: Dispatch<SetStateAction<NoteState>>,
  note: Note,
  title: string,
  content: string
) => {
  try {
    const updatedNote = {
      ...note,
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    await noteService.updateNote(updatedNote);
    setState((prevState) => ({
      ...prevState,
      notes: updateNoteInState(prevState.notes, updatedNote),
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
      error: null,
    }));

    return true;
  } catch (err) {
    setError(setState, 'Failed to save note');
    return false;
  }
};

export const deleteNote = async (
  setState: Dispatch<SetStateAction<NoteState>>,
  note: Note
) => {
  try {
    await noteService.deleteNote(note.id);
    setState((prevState) => ({
      ...prevState,
      notes: prevState.notes.filter((n) => n.id !== note.id),
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
      error: null,
    }));

    return true;
  } catch (err) {
    setError(setState, 'Failed to delete note');
    return false;
  }
};

export const archiveNote = async (
  setState: Dispatch<SetStateAction<NoteState>>,
  note: Note
) => {
  try {
    const updatedNote = {
      ...note,
      archived: !note.archived,
      updatedAt: new Date().toISOString(),
    };

    await noteService.updateNote(updatedNote);
    setState((prevState) => ({
      ...prevState,
      notes: updateNoteInState(prevState.notes, updatedNote),
      selectedNote: null,
      editorContent: {
        title: '',
        content: '',
      },
      error: null,
    }));

    return true;
  } catch (err) {
    setError(setState, 'Failed to archive note');
    return false;
  }
};
