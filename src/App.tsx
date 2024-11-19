import {
  Archive,
  ChevronRight,
  Feather,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Tag,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('all-notes');
  const [markdownContent, setMarkdownContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Getting Started with React',
      content: 'React is a powerful library for building user interfaces. Here are some key concepts...',
      tags: ['react', 'dev', 'typescript'],
      createdAt: '2024-03-20'
    },
    {
      id: 2,
      title: 'Markdown Tips and Tricks',
      content: 'Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents...',
      tags: ['dev', 'writing'],
      createdAt: '2024-03-19'
    },
    {
      id: 3,
      title: 'Project Ideas',
      content: 'Here are some interesting project ideas to work on...',
      tags: ['personal', 'dev'],
      createdAt: '2024-03-18'
    }
  ]);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setMarkdownContent(note.content);
    setNoteTitle(note.title);
  };

  const handleContentChange = (newContent: string) => {
    setMarkdownContent(newContent);
    if (selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, content: newContent }
          : note
      );
      setNotes(updatedNotes);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setNoteTitle(newTitle);
    if (selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? { ...note, title: newTitle }
          : note
      );
      setNotes(updatedNotes);
    }
  };

  const tags = [
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

  return (
    <div className='h-screen flex bg-gray-50'>
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo Section */}
        <div className='p-6'>
          <div className='flex items-center gap-2'>
            <Feather className='w-6 h-6 text-blue-700' />
            <h1 className='text-xl font-semibold text-gray-900'>AppNote</h1>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='p-3'>
          <button
            onClick={() => setCurrentView('all-notes')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'all-notes'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className='w-5 h-5 text-blue-700' />
            <span>All Notes</span>
            {currentView === 'all-notes' && <ChevronRight className='w-4 h-4 ml-auto' />}
          </button>
          <button
            onClick={() => setCurrentView('archived')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'archived'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Archive className='w-5 h-5 text-blue-700' />
            <span>Archived Notes</span>
            {currentView === 'archived' && <ChevronRight className='w-4 h-4 ml-auto' />}
          </button>
        </div>

        {/* Tags Section */}
        <div className='p-3 border-t border-gray-200'>
          <h2 className='text-sm font-medium text-gray-500 px-3 mb-2'>Tags</h2>
          <div className='space-y-1'>
            {tags.map((tag) => (
              <button
                key={tag}
                className='w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <Tag className='w-4 h-4' />
                <span className='text-sm capitalize font-bold'>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col bg-white'>
        {/* Header with burger menu and search */}
        <div className='border-b border-gray-200'>
          <div className='flex items-center justify-between p-6'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <Menu className='w-5 h-5 text-gray-600' />
              </button>
              <h1 className='text-2xl font-semibold text-gray-900'>All Notes</h1>
            </div>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <Search className='w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search in all notes...'
                  className='w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors'
                />
              </div>
              <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Settings className='w-5 h-5 text-gray-600' />
              </button>
            </div>
          </div>
        </div>

        {/* All Notes View */}
        {currentView === 'all-notes' && (
          <div className='flex-1 flex flex-col'>
            {/* Three Column Layout */}
            <div className={`grid h-full ${selectedNote ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {/* Left Column (1fr) */}
              <div className='col-span-1 h-full border-r border-gray-200'>
                <div className='p-4'>
                  {/* New Note Button */}
                  <button className='w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-blue-700 text-white rounded-lg transition-colors hover:bg-blue-800 font-medium'>
                    <Plus className='w-5 h-5' />
                    <span>New Note</span>
                  </button>
                  <div className='space-y-2'>
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className={`p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                          selectedNote?.id === note.id ? 'border-blue-700' : ''
                        }`}
                      >
                        <h3 className='font-medium text-gray-900 mb-2'>{note.title}</h3>
                        <div className='flex flex-wrap gap-1 mb-2'>
                          {note.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className='px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className='text-xs text-gray-500'>
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }).toLowerCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className={`${selectedNote ? 'col-span-2' : 'col-span-2'} h-full`}>
                <div className='h-full p-4'>
                  {/* Editor Mode Toggle */}
                  <div className='mb-4 flex items-center justify-end space-x-2'>
                    <button
                      onClick={() => setIsMarkdownMode(false)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        !isMarkdownMode
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Plain Text
                    </button>
                    <button
                      onClick={() => setIsMarkdownMode(true)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isMarkdownMode
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Markdown
                    </button>
                  </div>

                  {/* Note Title Input */}
                  <div className='mb-4'>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Note title..."
                      className='w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors'
                    />
                  </div>

                  {/* Editor */}
                  <div data-color-mode="light" className='h-[calc(100%-3rem)]'>
                    {isMarkdownMode ? (
                      <MDEditor
                        value={markdownContent}
                        onChange={(val) => handleContentChange(val || '')}
                        height="100%"
                        preview="edit"
                        hideToolbar={false}
                      />
                    ) : (
                      <textarea
                        value={markdownContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className='w-full h-full p-4 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors resize-none'
                        placeholder="Start writing your note here..."
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (1fr) - Only show when note is selected */}
              {selectedNote && (
                <div className='col-span-1 h-full border-l border-gray-200'>
                  <div className='p-4'>
                    <div className='space-y-4'>
                      <button
                        className='w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                      >
                        <Archive className='w-4 h-4' />
                        Archive Note
                      </button>
                      <button
                        className='w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors'
                      >
                        <Trash2 className='w-4 h-4' />
                        Delete Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Note Editor View */}
        {currentView === 'editor' && (
          <div className='flex-1 p-6'>
            <input
              type='text'
              placeholder='Note title...'
              className='w-full text-3xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400'
            />
            <textarea
              placeholder='Start writing your note here...'
              className='w-full mt-6 text-gray-600 border-none focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400 resize-none'
              rows={20}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
