import { AddNoteModal } from '@/components';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { useNoteStore } from '@/store/useNoteStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useFontStore } from '@/store/useFontStore';
import { CurrentView, Note } from '@/types';
import { useState, useEffect } from 'react';
import { MobileArchivedView } from './components/MobileArchivedView';
import { MobileNavigation } from './components/MobileNavigation';
import { MobileNoteEditor } from './components/MobileNoteEditor';
import { MobileNoteList } from './components/MobileNoteList';
import { MobileSearchView } from './components/MobileSearchView';
import { MobileSettingsView } from './components/MobileSettingsView';
import { Feather } from 'lucide-react';
import { defaultThemes } from '@/store/useThemeStore';

export const Mobile = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const {
    notes,
    selectedNote,
    editorContent,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    handleArchiveNote,
    handleDeleteNote,
    clearSelectedNote,
    getFilteredNotes,
    handleUnarchiveNote,
    handleNewNote,
    setSelection,
  } = useNotes();
  const { tags, selectedTag, setSelectedTag } = useTags();
  const { searchQuery, setSearchQuery } = useNoteStore();
  const { isDark, currentTheme } = useThemeStore();
  const { currentFont } = useFontStore();
  const theme = defaultThemes[currentTheme] || defaultThemes.navy;

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.fontFamily = currentFont.fontFamily;
  }, [isDark, currentFont]);

  const showSuccess = (message: string) => {
    // TODO: Implement toast or notification system
    console.log('Success:', message);
  };

  const handleMobileNoteSelect = (note: Note) => {
    handleNoteSelect(note);
    setCurrentView('editor');
  };

  const handleMobileNavigation = (view: CurrentView) => {
    if (view === 'new-note') {
      setIsAddNoteModalOpen(true);
    } else {
      setCurrentView(view);
      clearSelectedNote();
    }
  };

  const handleMobileArchiveNote = async (note: Note) => {
    await handleArchiveNote(note);
    showSuccess('Note archived');
    setCurrentView('all-notes');
  };

  const handleMobileDeleteNote = async (note: Note) => {
    await handleDeleteNote(note);
    showSuccess('Note deleted');
    setCurrentView('all-notes');
  };

  const handleMobileUnarchiveNote = async (note: Note) => {
    await handleUnarchiveNote(note);
    showSuccess('Note unarchived');
    setCurrentView('all-notes');
  };

  const handleNewNoteSubmit = async (data: { title: string; content: string; tags: string[] }) => {
    await handleNewNote(data);
    setIsAddNoteModalOpen(false);
    setCurrentView('all-notes');
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const getViewNotes = () => {
    const filteredNotes = notes.filter(note => {
      // Filter by archive status
      if (currentView === 'archived') {
        return note.archived;
      }
      if (!note.archived) {
        // Filter by search query
        const matchesSearch = searchQuery
          ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;

        // Filter by selected tag
        const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;

        return matchesSearch && matchesTag;
      }
      return false;
    });

    return filteredNotes;
  };

  if (selectedNote && currentView === 'editor') {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground" style={{ fontFamily: currentFont.fontFamily }}>
        <MobileNoteEditor
          note={selectedNote}
          content={editorContent}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onSave={handleSaveNote}
          onDelete={() => handleMobileDeleteNote(selectedNote)}
          onArchive={() => handleMobileArchiveNote(selectedNote)}
          onBack={() => {
            handleCancelEdit();
            setCurrentView('all-notes');
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground" style={{ fontFamily: currentFont.fontFamily }}>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {currentView === 'search' ? (
            <MobileSearchView
              onNavigate={handleMobileNavigation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              notes={getViewNotes()}
              onNoteSelect={handleMobileNoteSelect}
              tags={tags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          ) : currentView === 'archived' ? (
            <MobileArchivedView
              notes={getViewNotes()}
              onUnarchive={handleMobileUnarchiveNote}
              onNoteSelect={handleMobileNoteSelect}
            />
          ) : currentView === 'settings' ? (
            <MobileSettingsView />
          ) : (
            <MobileNoteList
              notes={getViewNotes()}
              onArchive={handleMobileArchiveNote}
              onNavigate={handleMobileNavigation}
              onNoteSelect={handleMobileNoteSelect}
            />
          )}
        </div>
      </div>
      <MobileNavigation currentView={currentView} onNavigate={handleMobileNavigation} />
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSave={handleNewNoteSubmit}
        availableTags={tags}
        existingNotes={notes}
      />
    </div>
  );
};
