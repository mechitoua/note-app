import { useNoteStore } from './useNoteStore'
import { Note } from '@/types/note'

// Selectors for filtering notes
export const useFilteredNotes = () => {
  return useNoteStore(state => {
    const { notes, currentView, selectedTag } = state
    
    // First filter by view (archived/non-archived)
    let filteredNotes = selectedTag
      ? notes // When tag is selected, search through all notes
      : notes.filter(note => note.archived === (currentView === 'archived'))

    // Then filter by tag if selected
    if (selectedTag) {
      filteredNotes = filteredNotes.filter(note =>
        note.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    }

    return filteredNotes
  })
}

// Selector for editor state
export const useEditorState = () => {
  return useNoteStore(state => ({
    selectedNote: state.selectedNote,
    editorContent: state.editorContent,
    updateEditorContent: state.updateEditorContent,
    clearSelectedNote: state.clearSelectedNote
  }))
}

// Selector for note operations
export const useNoteOperations = () => {
  return useNoteStore(state => ({
    createNote: state.createNote,
    updateNote: state.updateNote,
    archiveNote: state.archiveNote,
    unarchiveNote: state.unarchiveNote,
    deleteNote: state.deleteNote,
    selectNote: state.selectNote
  }))
}

// Selector for view state
export const useViewState = () => {
  return useNoteStore(state => ({
    currentView: state.currentView,
    setCurrentView: state.setCurrentView,
    selectedTag: state.selectedTag,
    setSelectedTag: state.setSelectedTag
  }))
}

// Selector for tags
export const useTagState = () => {
  return useNoteStore(state => ({
    tags: state.tags,
    selectedTag: state.selectedTag,
    setSelectedTag: state.setSelectedTag
  }))
}

// Selector for loading and error states
export const useNoteStatus = () => {
  return useNoteStore(state => ({
    isLoading: state.isLoading,
    error: state.error
  }))
}

// Selector for modal state
export const useModalState = () => {
  return useNoteStore(state => ({
    isAddNoteModalOpen: state.isAddNoteModalOpen,
    setIsAddNoteModalOpen: state.setIsAddNoteModalOpen
  }))
}
