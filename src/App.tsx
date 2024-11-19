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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('all-notes');
  const [markdownContent, setMarkdownContent] = useState("# Hello World\n\nStart writing your note here...");
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
            <div className='flex-1 grid grid-cols-4 divide-x divide-gray-200'>
              {/* Left Column (1fr) */}
              <div className='col-span-1 overflow-y-auto'>
                <div className='p-4'>
                  {/* New Note Button */}
                  <button className='w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-blue-700 text-white rounded-lg transition-colors hover:bg-blue-800 font-medium'>
                    <Plus className='w-5 h-5' />
                    <span>New Note</span>
                  </button>
                  <div className='space-y-2'>
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className='p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-700 cursor-pointer transition-colors'
                      >
                        <h3 className='font-medium text-gray-900 mb-1'>Note Title {item}</h3>
                        <p className='text-sm text-gray-500 line-clamp-2'>
                          This is a preview of the note content that might span multiple lines...
                        </p>
                        <p className='text-xs text-gray-400 mt-2'>2 hours ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column (2fr) */}
              <div className='col-span-2 h-full'>
                <div className='h-full p-4'>
                  <div data-color-mode="light" className='h-full'>
                    <MDEditor
                      value={markdownContent}
                      onChange={(val) => setMarkdownContent(val || '')}
                      height="100%"
                      preview="live"
                      hideToolbar={false}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (1fr) */}
              <div className='col-span-1 p-4 border-l border-gray-200'>
                <div className='space-y-3'>
                  <button
                    className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg transition-colors hover:bg-gray-200 font-medium'
                  >
                    <Archive className='w-5 h-5' />
                    <span>Archive Note</span>
                  </button>
                  <button
                    className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg transition-colors hover:bg-red-100 font-medium'
                  >
                    <Trash2 className='w-5 h-5' />
                    <span>Delete Note</span>
                  </button>
                </div>
              </div>
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
