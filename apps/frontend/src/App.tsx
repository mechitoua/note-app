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
import { useTags } from '@/hooks/useTags';
import { CurrentView } from '@/types';
import { useState, useEffect } from 'react';

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

  const handleNewNoteWithTags = (note: { title: string; tags: string[] }) => {
    handleNewNote({
      title: note.title,
      content: '',
      tags: note.tags,
    });
    addTags(note.tags);
  };

  const filteredNotes = notes.filter(note => {
    // First filter by archive status
    const archiveFilter = currentView === 'archived' ? note.archived : !note.archived;
    
    // Then filter by selected tag if one is selected (case insensitive)
    const tagFilter = selectedTag 
      ? note.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      : true;
    
    return archiveFilter && tagFilter;
  });

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
              <div className='h-full grid' style={{ gridTemplateColumns: '1.5fr 2fr 0.7fr' }}>
                <NoteList
                  notes={filteredNotes}
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
          onSave={handleNewNoteWithTags}
          availableTags={tags}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
