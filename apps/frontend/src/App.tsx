import {
  AddNoteModal,
  ArchivedNotes,
  EmptyState,
  Header,
  NoteActions,
  NoteEditor,
  NoteList,
  Sidebar,
} from '@/components';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { useFontStore } from '@/store/useFontStore';
import { useNoteStore } from '@/store/useNoteStore';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { CurrentView } from '@/types';
import { normalizeTag } from '@/utils/tagUtils';
import { useEffect, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const {
    notes,
    selectedNote,
    editorContent,
    isAddNoteModalOpen,
    setIsAddNoteModalOpen,
    handleNewNote,
    handleNoteSelect,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    handleArchiveNote,
    handleDeleteNote,
    clearSelectedNote,
    getFilteredNotes,
    handleUnarchiveNote: originalHandleUnarchiveNote,
    fetchNotes,
    handleUpdateNoteTags,
    noteService,
  } = useNotes();

  const { tags, selectedTag, setSelectedTag, addTags, syncTags, clearSelectedTag } = useTags();

  const searchQuery = useNoteStore((state) => state.searchQuery); // Get the search query from the note store

  const { currentFont } = useFontStore();

  const { currentTheme } = useThemeStore();

  // Get theme with fallback to default ocean theme
  const theme = defaultThemes[currentTheme] || defaultThemes.ocean;

  useEffect(() => {
    syncTags(notes);
  }, [notes, syncTags]);

  const handleLogoClick = () => {
    clearSelectedNote();
    setCurrentView('all-notes');
    setSelectedTag(null);
  };

  const handleAllNotesClick = () => {
    clearSelectedNote();
    setCurrentView('all-notes');
    setSelectedTag(null);
  };

  const handleNewNoteWithTags = (note: { title: string; content: string; tags: string[] }) => {
    handleNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
    addTags(note.tags);
  };

  const getFilteredNotesByTag = (notes: any[]) => {
    if (!selectedTag) return notes;
    return notes.filter((note) =>
      note.tags.some((tag) => normalizeTag(tag) === normalizeTag(selectedTag))
    );
  };

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter first (across all notes)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    } else {
      // Only filter by archive status if there's no search query
      filtered = getFilteredNotes(currentView === 'archived');
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter((note) =>
        note.tags.some((tag) => normalizeTag(tag) === normalizeTag(selectedTag))
      );
    }

    return filtered;
  }, [notes, searchQuery, currentView, selectedTag, getFilteredNotes]);

  const handleUnarchiveNote = async (noteId: string) => {
    const success = await originalHandleUnarchiveNote(noteId);
    if (success) {
      // Switch to all notes view after unarchiving
      setCurrentView('all-notes');
      clearSelectedNote();
    }
  };

  const handleViewChange = (view: 'all-notes' | 'archived') => {
    clearSelectedNote();
    setCurrentView(view);
  };

  const handleAddTags = async (tags: string[]) => {
    if (!selectedNote) return;

    // Update note tags
    const success = await handleUpdateNoteTags(selectedNote.id, tags);
    if (success) {
      // Refresh notes and sync tags
      await fetchNotes();
      const updatedNotes = await noteService.getNotes();
      syncTags(updatedNotes);
    }
  };

  return (
    <ThemeProvider>
      <div
        className={`min-h-screen ${theme.colors.background} transition-colors duration-200`}
        style={{ fontFamily: currentFont.fontFamily }}
      >
        <div className='h-screen flex overflow-hidden'>
          <Sidebar
            isOpen={isSidebarOpen}
            currentView={currentView}
            onViewChange={handleViewChange}
            onAllNotesClick={handleAllNotesClick}
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            className={theme.colors.surface}
          />
          <main className={`flex-1 flex flex-col ${theme.colors.surface} overflow-hidden`}>
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              title={
                selectedTag
                  ? `Tag: ${selectedTag}`
                  : currentView === 'all-notes'
                    ? 'All Notes'
                    : 'Archived Notes'
              }
              onLogoClick={handleLogoClick}
              isSearching={!!searchQuery}
              totalResults={filteredNotes.length}
            />
            <div className='flex-1 overflow-hidden'>
              <PanelGroup direction='horizontal'>
                <Panel defaultSize={30} minSize={30}>
                  {currentView === 'archived' ? (
                    <ArchivedNotes
                      notes={filteredNotes}
                      onNoteSelect={handleNoteSelect}
                      onUnarchive={handleUnarchiveNote}
                      selectedNoteId={selectedNote?.id}
                    />
                  ) : (
                    <NoteList
                      notes={filteredNotes}
                      selectedNoteId={selectedNote?.id}
                      onNoteSelect={handleNoteSelect}
                      onCreateNote={() => setIsAddNoteModalOpen(true)}
                      onArchive={handleArchiveNote}
                      onUnarchive={handleUnarchiveNote}
                    />
                  )}
                </Panel>
                <PanelResizeHandle className='w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors' />
                <Panel minSize={40} defaultSize={80}>
                  {selectedNote && (
                    <div className='h-full grid grid-cols-[1fr,250px]'>
                      <NoteEditor
                        title={editorContent.title}
                        content={editorContent.content}
                        onTitleChange={handleTitleChange}
                        onContentChange={handleContentChange}
                        onSave={handleSaveNote}
                        onCancel={() => handleCancelEdit()}
                        selectedTag={selectedTag}
                      />
                      <NoteActions
                        selectedNote={selectedNote}
                        onArchive={handleArchiveNote}
                        onDelete={handleDeleteNote}
                        onAddTags={handleAddTags}
                        onUpdateTags={handleAddTags}
                        availableTags={tags}
                      />
                    </div>
                  )}
                  {!selectedNote && <EmptyState />}
                </Panel>
              </PanelGroup>
            </div>
          </main>
        </div>
      </div>
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSave={handleNewNote}
        availableTags={tags}
        existingNotes={notes}
      />
    </ThemeProvider>
  );
}

export default App;
