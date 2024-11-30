import { AddNoteModal } from '@/components';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { noteService } from '@/services/noteService';
import { useNoteStore } from '@/store/useNoteStore';
import { CurrentView, Note } from '@/types';
import { useState } from 'react';
import { MobileArchivedView } from './components/MobileArchivedView';
import { MobileNavigation } from './components/MobileNavigation';
import { MobileNoteEditor } from './components/MobileNoteEditor';
import { MobileNoteList } from './components/MobileNoteList';
import { MobileSearchView } from './components/MobileSearchView';

export const Mobile = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const {
    notes,
    selectedNote,
    clearSelectedNote,
    fetchNotes,
    handleNoteSelect,
    handleTitleChange,
    handleContentChange,
    handleSaveNote,
    handleDeleteNote,
    handleArchiveNote,
    handleUnarchiveNote,
    editorContent,
  } = useNotes();
  const { tags, selectedTag } = useTags();
  const { searchQuery, setSearchQuery } = useNoteStore();

  const showSuccess = (message: string) => {
    // TODO: Implement toast or notification system
    console.log('Success:', message);
  };

  const showError = (message: string) => {
    // TODO: Implement toast or notification system
    console.error('Error:', message);
  };

  const handleNewNote = async (data: { title: string; content: string; tags: string[] }) => {
    try {
      await noteService.createNote(data);
      showSuccess('Note created successfully');
      setIsAddNoteModalOpen(false);
      fetchNotes();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      showError(errorMessage);
    }
  };

  const handleMobileNavigation = (view: CurrentView) => {
    if (view === 'new-note') {
      setIsAddNoteModalOpen(true);
    } else {
      setCurrentView(view);
      clearSelectedNote();
    }
  };

  const handleMobileNoteSelect = (note: Note) => {
    handleNoteSelect(note);
    setCurrentView('editor');
  };

  const handleBackFromEditor = () => {
    clearSelectedNote();
    setCurrentView('all-notes');
  };

  const getFilteredNotes = () => {
    let filteredNotes = [...notes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNotes = filteredNotes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTag) {
      filteredNotes = filteredNotes.filter(note => note.tags.includes(selectedTag));
    }

    if (currentView === 'archived') {
      filteredNotes = filteredNotes.filter(note => note.archived);
    } else if (currentView !== 'search') {
      filteredNotes = filteredNotes.filter(note => !note.archived);
    }

    return filteredNotes;
  };

  if (currentView === 'editor' && selectedNote) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground">
        <div className="flex-1 overflow-hidden">
          <MobileNoteEditor
            note={selectedNote}
            content={{
              title: selectedNote.title || '',
              content: editorContent || selectedNote.content || '',
            }}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onSave={handleSaveNote}
            onDelete={() => handleDeleteNote()}
            onArchive={() => handleArchiveNote()}
            onBack={handleBackFromEditor}
          />
        </div>
        <MobileNavigation currentView={currentView} onNavigate={handleMobileNavigation} />
      </div>
    );
  }

  if (currentView === 'editor') {
    setCurrentView('all-notes');
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 overflow-hidden">
        <div className="h-screen flex flex-col">
          {currentView === 'search' ? (
            <MobileSearchView
              onNavigate={handleMobileNavigation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              notes={getFilteredNotes()}
              onNoteSelect={handleMobileNoteSelect}
            />
          ) : currentView === 'archived' ? (
            <MobileArchivedView
              notes={getFilteredNotes()}
              onUnarchive={handleUnarchiveNote}
              onNavigate={handleMobileNavigation}
              onNoteSelect={handleMobileNoteSelect}
            />
          ) : (
            <MobileNoteList
              notes={getFilteredNotes()}
              onDelete={handleDeleteNote}
              onArchive={handleArchiveNote}
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
        onSave={handleNewNote}
        availableTags={tags}
        existingNotes={notes}
      />
    </div>
  );
};
