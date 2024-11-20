import { renderHook, act } from '@testing-library/react';
import { useNotes } from '../useNotes';
import { noteService } from '@/services/noteService';

jest.mock('@/services/noteService', () => ({
  noteService: {
    getNotes: jest.fn(),
    saveNote: jest.fn(),
    deleteNote: jest.fn(),
    archiveNote: jest.fn(),
    unarchiveNote: jest.fn(),
  },
}));

describe('useNotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (noteService.getNotes as jest.Mock).mockResolvedValue([]);
  });

  it('should load notes on mount', async () => {
    const mockNotes = [
      {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        tags: [],
        createdAt: new Date().toISOString(),
      },
    ];

    (noteService.getNotes as jest.Mock).mockResolvedValueOnce(mockNotes);

    const { result } = renderHook(() => useNotes());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.notes).toEqual(mockNotes);
    expect(result.current.error).toBeNull();
  });

  it('should handle note creation', async () => {
    const newNote = {
      id: 1,
      title: 'New Note',
      content: '',
      tags: [],
      createdAt: expect.any(String),
    };

    (noteService.saveNote as jest.Mock).mockResolvedValueOnce(newNote);

    const { result } = renderHook(() => useNotes());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleNewNote();
    });

    expect(noteService.saveNote).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Note',
      content: '',
      tags: [],
    }));
    expect(result.current.notes).toContainEqual(newNote);
    expect(result.current.selectedNote).toEqual(newNote);
  });

  it('should handle note selection and editing', async () => {
    const mockNote = {
      id: 1,
      title: 'Test Note',
      content: 'Test Content',
      tags: [],
      createdAt: new Date().toISOString(),
    };

    const { result } = renderHook(() => useNotes());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.handleNoteClick(mockNote);
    });

    expect(result.current.selectedNote).toEqual(mockNote);
    expect(result.current.noteTitle).toBe(mockNote.title);
    expect(result.current.markdownContent).toBe(mockNote.content);

    act(() => {
      result.current.handleTitleChange('Updated Title');
      result.current.handleContentChange('Updated Content');
    });

    expect(result.current.noteTitle).toBe('Updated Title');
    expect(result.current.markdownContent).toBe('Updated Content');
  });

  it('should save note changes', async () => {
    const mockNote = {
      id: 1,
      title: 'Test Note',
      content: 'Test Content',
      tags: [],
      createdAt: new Date().toISOString(),
    };

    const updatedNote = {
      ...mockNote,
      title: 'Updated Title',
      content: 'Updated Content',
    };

    (noteService.saveNote as jest.Mock).mockResolvedValueOnce(updatedNote);

    const { result } = renderHook(() => useNotes());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.handleNoteClick(mockNote);
      result.current.handleTitleChange('Updated Title');
      result.current.handleContentChange('Updated Content');
    });

    await act(async () => {
      await result.current.handleSaveNote();
    });

    expect(noteService.saveNote).toHaveBeenCalledWith(expect.objectContaining({
      id: mockNote.id,
      title: 'Updated Title',
      content: 'Updated Content',
    }));
    expect(result.current.selectedNote).toEqual(updatedNote);
  });

  it('should handle errors', async () => {
    const error = new Error('Failed to load notes');
    (noteService.getNotes as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useNotes());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Failed to load notes');
    expect(result.current.isLoading).toBe(false);
  });
});
