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
import { CurrentView } from '@/types';
import { useState, useEffect } from 'react';
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
  } = useNotes();

  const {
    tags,
    selectedTag,
    setSelectedTag,
    addTags,
    syncTags,
    clearSelectedTag,
  } = useTags();

  useEffect(() => {
    syncTags(notes);
  }, [notes, syncTags]);

  const handleLogoClick = () => {
    clearSelectedNote();
    clearSelectedTag();
  };

  const handleNewNoteWithTags = (note: { title: string; content: string; tags: string[] }) => {
    handleNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
    addTags(note.tags);
  };

  const filteredNotes = getFilteredNotes(currentView === 'archived').filter(note => {
    // Filter by selected tag if one is selected (case insensitive)
    return selectedTag 
      ? note.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      : true;
  });

  const handleUnarchiveNote = async (noteId: string) => {
    const success = await originalHandleUnarchiveNote(noteId);
    if (success) {
      // Switch to all notes view after unarchiving
      setCurrentView('all-notes');
      clearSelectedNote();
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className='h-screen flex overflow-hidden'>
          <Sidebar
            isOpen={isSidebarOpen}
            currentView={currentView}
            onViewChange={setCurrentView}
            onAllNotesClick={handleLogoClick}
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
          <main className='flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden'>
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              title={selectedTag ? `Tag: ${selectedTag}` : currentView === 'all-notes' ? 'All Notes' : 'Archived Notes'}
              onLogoClick={handleLogoClick}
            />
            <div className='flex-1 overflow-hidden'>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={35} minSize={30}>
                  {currentView === 'archived' ? (
                    <ArchivedNotes
                      notes={filteredNotes}
                      onNoteSelect={handleNoteSelect}
                      onUnarchive={handleUnarchiveNote}
                    />
                  ) : (
                    <NoteList
                      notes={filteredNotes}
                      selectedNoteId={selectedNote?.id}
                      onNoteSelect={handleNoteSelect}
                      onCreateNote={() => setIsAddNoteModalOpen(true)}
                    />
                  )}
                </Panel>
                <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />
                <Panel minSize={30}>
                  {selectedNote ? (
                    <div className="h-full grid grid-cols-[1fr,250px]">
                      <NoteEditor
                        title={editorContent.title}
                        content={editorContent.content}
                        onTitleChange={handleTitleChange}
                        onContentChange={handleContentChange}
                        onSave={handleSaveNote}
                        onCancel={() => handleCancelEdit()}
                      />
                      <NoteActions
                        selectedNote={selectedNote}
                        onArchive={selectedNote.archived ? () => handleUnarchiveNote(selectedNote.id) : handleArchiveNote}
                        onDelete={handleDeleteNote}
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </Panel>
              </PanelGroup>
            </div>
          </main>
        </div>
      </div>
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSave={handleNewNoteWithTags}
        availableTags={tags}
      />
    </ThemeProvider>
  );
}

export default App;
