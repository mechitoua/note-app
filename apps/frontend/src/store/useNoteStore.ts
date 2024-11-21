import { create } from 'zustand'
import { Note } from '@/types/note'
import { noteService } from '@/services/noteService'

interface EditorContent {
  title: string
  content: string
  tags: string[]
}

interface NoteStore {
  // State
  notes: Note[]
  selectedNote: Note | null
  editorContent: EditorContent | null
  currentView: 'all-notes' | 'archived'
  selectedTag: string | null
  tags: string[]
  isLoading: boolean
  error: string | null
  isAddNoteModalOpen: boolean

  // Actions
  fetchNotes: () => Promise<void>
  createNote: (title: string, content: string, tags: string[]) => Promise<boolean>
  updateNote: (noteId: string, title: string, content: string) => Promise<boolean>
  archiveNote: (noteId: string) => Promise<boolean>
  unarchiveNote: (noteId: string) => Promise<boolean>
  deleteNote: (noteId: string) => Promise<boolean>
  selectNote: (note: Note) => void
  clearSelectedNote: () => void
  updateEditorContent: (content: Partial<EditorContent>) => void
  setCurrentView: (view: 'all-notes' | 'archived') => void
  setSelectedTag: (tag: string | null) => void
  setIsAddNoteModalOpen: (isOpen: boolean) => void
  syncTags: () => void
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  // Initial state
  notes: [],
  selectedNote: null,
  editorContent: null,
  currentView: 'all-notes',
  selectedTag: null,
  tags: [],
  isLoading: false,
  error: null,
  isAddNoteModalOpen: false,

  // Actions
  fetchNotes: async () => {
    set({ isLoading: true })
    try {
      const notes = await noteService.getNotes()
      set({ notes, isLoading: false, error: null })
      get().syncTags()
    } catch (err) {
      set({ isLoading: false, error: 'Failed to fetch notes' })
    }
  },

  createNote: async (title: string, content: string, tags: string[]) => {
    set({ isLoading: true })
    try {
      const newNote = await noteService.createNote({ title, content, tags })
      set(state => ({
        notes: [newNote, ...state.notes],
        isLoading: false,
        error: null
      }))
      get().syncTags()
      return true
    } catch (err) {
      set({ isLoading: false, error: 'Failed to create note' })
      return false
    }
  },

  updateNote: async (noteId: string, title: string, content: string) => {
    set({ isLoading: true })
    try {
      const updatedNote = await noteService.updateNote(noteId, { title, content })
      set(state => ({
        notes: state.notes.map(note => 
          note.id === noteId ? updatedNote : note
        ),
        isLoading: false,
        error: null
      }))
      return true
    } catch (err) {
      set({ isLoading: false, error: 'Failed to update note' })
      return false
    }
  },

  archiveNote: async (noteId: string) => {
    set({ isLoading: true })
    try {
      const archivedNote = await noteService.archiveNote(noteId)
      set(state => ({
        notes: state.notes.map(note => 
          note.id === noteId ? archivedNote : note
        ),
        selectedNote: null,
        editorContent: null,
        isLoading: false,
        error: null
      }))
      return true
    } catch (err) {
      set({ isLoading: false, error: 'Failed to archive note' })
      return false
    }
  },

  unarchiveNote: async (noteId: string) => {
    set({ isLoading: true })
    try {
      const unarchivedNote = await noteService.unarchiveNote(noteId)
      set(state => ({
        notes: state.notes.map(note => 
          note.id === noteId ? unarchivedNote : note
        ),
        isLoading: false,
        error: null
      }))
      return true
    } catch (err) {
      set({ isLoading: false, error: 'Failed to unarchive note' })
      return false
    }
  },

  deleteNote: async (noteId: string) => {
    set({ isLoading: true })
    try {
      await noteService.deleteNote(noteId)
      set(state => ({
        notes: state.notes.filter(note => note.id !== noteId),
        selectedNote: null,
        editorContent: null,
        isLoading: false,
        error: null
      }))
      get().syncTags()
      return true
    } catch (err) {
      set({ isLoading: false, error: 'Failed to delete note' })
      return false
    }
  },

  selectNote: (note: Note) => {
    set({
      selectedNote: note,
      editorContent: {
        title: note.title,
        content: note.content,
        tags: note.tags
      }
    })
  },

  clearSelectedNote: () => {
    set({
      selectedNote: null,
      editorContent: null
    })
  },

  updateEditorContent: (content: Partial<EditorContent>) => {
    set(state => ({
      editorContent: state.editorContent
        ? { ...state.editorContent, ...content }
        : null
    }))
  },

  setCurrentView: (view: 'all-notes' | 'archived') => {
    set({
      currentView: view,
      selectedNote: null,
      editorContent: null
    })
  },

  setSelectedTag: (tag: string | null) => {
    set({ selectedTag: tag })
  },

  setIsAddNoteModalOpen: (isOpen: boolean) => {
    set({ isAddNoteModalOpen: isOpen })
  },

  syncTags: () => {
    const allTags = new Set<string>()
    get().notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag))
    })
    set({ tags: Array.from(allTags).sort() })
  }
}))
