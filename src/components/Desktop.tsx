import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { noteService } from '@/services/noteService';
import { useFontStore } from '@/store/useFontStore';
import { useNoteStore } from '@/store/useNoteStore';
import { useThemeStore } from '@/store/useThemeStore';
import { CurrentView } from '@/types';
import { defaultThemes } from '@/types/theme';
import { useEffect, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AddNoteModal } from './AddNoteModal';
import { ArchivedNotes } from './ArchivedNotes';
import { EmptyState } from './EmptyState/EmptyState';
import { Header } from './Header/Header';
import { NoteActions } from './NoteActions';
import { NoteEditor } from './NoteEditor';
import { NoteList } from './NoteList';
import { Sidebar } from './Sidebar';

export const Desktop = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const { notes, selectedNote, handleNoteSelect, clearSelectedNote, fetchNotes } = useNotes();
  const { tags, selectedTag, setSelectedTag } = useTags();
  const {
    searchQuery,
    setSearchQuery,
    handleTitleChange,
    handleContentChange,
    handleSaveNote,
    handleDeleteNote,
    editorContent,
  } = useNoteStore();
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const currentFont = useFontStore(state => state.currentFont);

  const theme = defaultThemes[useThemeStore(state => state.currentTheme)] || defaultThemes.navy;

  useKeyboardShortcuts();

  useEffect(() => {
    if (selectedTag) {
      setCurrentView('all-notes');
    }
  }, [selectedTag]);

  const showSuccess = (message: string) => {
    // TODO: Implement toast or notification system
    console.log('Success:', message);
  };

  const showError = (message: string) => {
    // TODO: Implement toast or notification system
    console.error('Error:', message);
  };

  const handleViewChange = (view: CurrentView) => {
    setCurrentView(view);
    setSelectedTag(null);
  };

  const handleLogoClick = () => {
    setCurrentView('all-notes');
    setSelectedTag(null);
    clearSelectedNote();
  };

  const handleArchiveNote = async (noteId: string) => {
    try {
      await noteService.archiveNote(noteId);
      showSuccess('Note archived successfully');
      if (selectedNote?.id === noteId) {
        clearSelectedNote();
      }
      fetchNotes();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive note';
      showError(errorMessage);
    }
  };

  const handleUnarchiveNote = async (noteId: string) => {
    try {
      await noteService.unarchiveNote(noteId);
      showSuccess('Note unarchived successfully');
      if (selectedNote?.id === noteId) {
        clearSelectedNote();
      }
      fetchNotes();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unarchive note';
      showError(errorMessage);
    }
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

  const handleCancelEdit = () => {
    clearSelectedNote();
  };

  const handleAddTags = async (noteId: string, tags: string[]) => {
    try {
      await noteService.updateNoteTags(noteId, tags);
      showSuccess('Tags updated successfully');
      fetchNotes();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update tags';
      showError(errorMessage);
    }
  };

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (searchQuery) {
      filtered = notes.filter(
        note =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    if (currentView === 'archived') {
      filtered = filtered.filter(note => note.archived);
    } else {
      filtered = filtered.filter(note => !note.archived);
    }

    return filtered;
  }, [notes, searchQuery, selectedTag, currentView]);

  return (
    <div
      className={`min-h-screen ${theme.colors.background} transition-colors duration-200`}
      style={{ fontFamily: currentFont.fontFamily }}
    >
      <div className="h-screen flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
          onAllNotesClick={() => {
            setCurrentView('all-notes');
            setSelectedTag(null);
          }}
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
          <div className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={30} minSize={20}>
                {currentView === 'archived' ? (
                  <ArchivedNotes
                    notes={filteredNotes}
                    onNoteSelect={handleNoteSelect}
                    onUnarchive={handleUnarchiveNote}
                    selectedNoteId={selectedNote?.id ?? ''}
                  />
                ) : (
                  <NoteList
                    notes={filteredNotes}
                    selectedNoteId={selectedNote?.id ?? ''}
                    onNoteSelect={handleNoteSelect}
                    onCreateNote={() => setIsAddNoteModalOpen(true)}
                    onArchive={handleArchiveNote}
                    onUnarchive={handleUnarchiveNote}
                  />
                )}
              </Panel>
              <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />
              <Panel minSize={30} defaultSize={70}>
                {selectedNote && (
                  <div className="h-full grid grid-cols-[1fr,250px]">
                    <NoteEditor
                      title={editorContent?.title ?? ''}
                      content={editorContent?.content ?? ''}
                      onTitleChange={handleTitleChange}
                      onContentChange={handleContentChange}
                      onSave={handleSaveNote}
                      onCancel={() => handleCancelEdit()}
                      selectedTag={selectedTag}
                      tags={selectedNote.tags}
                      lastEdited={new Date(selectedNote.updatedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
