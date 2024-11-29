import { useNoteStore } from './useNoteStore';
import { Note } from '@/types/note';

// Get filtered notes based on current view, selected tag, and search query
export const useFilteredNotes = () => {
  return useNoteStore(state => {
    let filteredNotes = [...state.notes];

    // Filter by view (all-notes or archived)
    if (state.currentView === 'archived') {
      filteredNotes = filteredNotes.filter(note => note.archived);
    } else {
      filteredNotes = filteredNotes.filter(note => !note.archived);
    }

    // Filter by selected tag
    if (state.selectedTag) {
      filteredNotes = filteredNotes.filter(note => note.tags.includes(state.selectedTag!));
    }

    // Filter by search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filteredNotes = filteredNotes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.content.toLowerCase().includes(query);
        const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // Sort by updatedAt in descending order (newest first)
    return filteredNotes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });
};

// Get all tags from notes
export const useTags = () => {
  return useNoteStore(state => state.tags);
};

// Get current view
export const useCurrentView = () => {
  return useNoteStore(state => state.currentView);
};

// Get selected tag
export const useSelectedTag = () => {
  return useNoteStore(state => state.selectedTag);
};

// Get selected note
export const useSelectedNote = () => {
  return useNoteStore(state => state.selectedNote);
};

// Get editor content
export const useEditorContent = () => {
  return useNoteStore(state => state.editorContent);
};

// Get search query
export const useSearchQuery = () => {
  return useNoteStore(state => state.searchQuery);
};
