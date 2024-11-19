import { EmptyState, Header, NoteActions, NoteEditor, NoteList, Sidebar } from '@/components';
import { useNotes } from '@/hooks/useNotes';
import { CurrentView } from '@/types';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<CurrentView>('all-notes');
  const {
    notes,
    selectedNote,
    setSelectedNote,
    noteTitle,
    markdownContent,
    handleNoteClick,
    handleContentChange,
    handleTitleChange,
    handleArchiveNote,
    handleDeleteNote,
    handleNewNote,
    handleSaveNote,
    handleCancelEdit,
  } = useNotes();

  // Predefined tags
  const defaultTags = [
    'cooking',
    'dev',
    'fitness',
    'health',
    'personal',
    'react',
    'recipes',
    'shopping',
    'travel',
    'typescript',
  ];

  const handleLogoClick = () => {
    setSelectedNote(null);
  };

  return (
    <div className='h-screen flex bg-gray-50'>
      <Sidebar
        isOpen={isSidebarOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
        tags={defaultTags}
      />
      <main className='flex-1 flex flex-col bg-white overflow-hidden'>
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
  );
}

export default App;
