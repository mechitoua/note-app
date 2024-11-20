import {
  AddNoteModal,
  EmptyState,
  Header,
  NoteActions,
  NoteEditor,
  NoteList,
  Sidebar,
} from '@/components';
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
  } = useNotes();

  const defaultTags = ['Personal', 'Work', 'Ideas'];

  const handleLogoClick = () => {
    clearSelectedNote();
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className='h-screen flex overflow-hidden'>
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
              <div className='h-full grid' style={{ gridTemplateColumns: '1fr 2.3fr 0.7fr' }}>
                <NoteList
                  notes={notes.filter((note) =>
                    currentView === 'archived' ? note.archived : !note.archived
                  )}
                  selectedNoteId={selectedNote?.id}
                  onNoteSelect={handleNoteSelect}
                  onCreateNote={() => setIsAddNoteModalOpen(true)}
                />
                {selectedNote ? (
                  <>
                    <div className='h-full overflow-hidden'>
                      <NoteEditor
                        title={editorContent.title}
                        content={editorContent.content}
                        onTitleChange={handleTitleChange}
                        onContentChange={handleContentChange}
                        onSave={handleSaveNote}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                    <NoteActions
                      selectedNote={selectedNote}
                      onArchive={() => handleArchiveNote(selectedNote.id)}
                      onDelete={() => handleDeleteNote(selectedNote.id)}
                    />
                  </>
                ) : (
                  <div className='col-span-2 flex items-center justify-center'>
                    <EmptyState />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          onSave={handleNewNote}
          availableTags={defaultTags}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
