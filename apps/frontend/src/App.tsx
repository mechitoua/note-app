import { EmptyState, Header, NoteActions, NoteEditor, NoteList, Sidebar } from '@/components';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useNotes } from '@/hooks/useNotes';
import { CurrentView } from '@/types';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const {
    notes,
    selectedNote,
    markdownContent,
    noteTitle,
    handleNewNote,
    handleNoteClick,
    handleContentChange,
    handleTitleChange,
    handleSaveNote,
    handleCancelEdit,
    handleArchiveNote,
    handleDeleteNote,
    clearSelectedNote,
  } = useNotes();

  const defaultTags = ['Personal', 'Work', 'Ideas'];

  const handleLogoClick = () => {
    clearSelectedNote();
  };

  return (
    <ThemeProvider>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='h-screen flex'>
          <Sidebar
            isOpen={isSidebarOpen}
            currentView={currentView}
            onViewChange={setCurrentView}
            onAllNotesClick={clearSelectedNote}
            tags={defaultTags}
          />
          <main className='flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden'>
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              title={currentView === 'all-notes' ? 'All Notes' : 'Archived Notes'}
              onLogoClick={handleLogoClick}
            />
            <div className='flex-1 overflow-hidden'>
              <div className={`grid h-full ${selectedNote ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <NoteList
                  notes={notes}
                  selectedNote={selectedNote}
                  onNoteClick={handleNoteClick}
                  onNewNote={handleNewNote}
                />
                {selectedNote ? (
                  <>
                    <NoteEditor
                      selectedNote={selectedNote}
                      markdownContent={markdownContent}
                      noteTitle={noteTitle}
                      handleContentChange={handleContentChange}
                      handleTitleChange={handleTitleChange}
                      onSave={handleSaveNote}
                      onCancel={handleCancelEdit}
                    />
                    <NoteActions
                      note={selectedNote}
                      onArchive={handleArchiveNote}
                      onDelete={handleDeleteNote}
                    />
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
