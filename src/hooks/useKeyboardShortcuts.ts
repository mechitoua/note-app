import { useNotes } from '@/hooks/useNotes';
import { useNoteStore } from '@/store/useNoteStore';
import { useHotkeys } from 'react-hotkeys-hook';

export const useKeyboardShortcuts = () => {
  const { notes, selectedNote, handleNoteSelect, handleDeleteNote, clearSelectedNote } = useNotes();

  const { currentView, setCurrentView, setSearchQuery, setIsAddNoteModalOpen } = useNoteStore();

  // Navigation with arrow keys (no modifiers)
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      if (!notes.length) return;

      const currentIndex = selectedNote ? notes.findIndex(note => note.id === selectedNote.id) : -1;
      const nextIndex = currentIndex + 1;
      if (nextIndex < notes.length) {
        handleNoteSelect(notes[nextIndex]);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      if (!notes.length) return;

      const currentIndex = selectedNote ? notes.findIndex(note => note.id === selectedNote.id) : -1;
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        handleNoteSelect(notes[prevIndex]);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  // Note Management
  useHotkeys(
    'alt+n',
    e => {
      e.preventDefault();
      setIsAddNoteModalOpen(true);
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+d',
    e => {
      e.preventDefault();
      if (selectedNote) {
        handleDeleteNote();
        clearSelectedNote();
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  // View Management
  useHotkeys(
    'escape',
    e => {
      e.preventDefault();
      clearSelectedNote();
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+s',
    e => {
      e.preventDefault();
      const searchInput = document.querySelector('[aria-label="Search notes"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+t',
    e => {
      e.preventDefault();
      setCurrentView(currentView === 'all-notes' ? 'archived' : 'all-notes');
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+c',
    e => {
      e.preventDefault();
      setSearchQuery('');
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+1',
    e => {
      e.preventDefault();
      setCurrentView('all-notes');
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  useHotkeys(
    'alt+2',
    e => {
      e.preventDefault();
      setCurrentView('archived');
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    }
  );

  return null;
};
