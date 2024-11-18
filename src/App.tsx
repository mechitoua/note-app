import { Menu, Plus, Search } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <aside
        className={`bg-sidebar border-r border-gray-200 ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-xl font-semibold text-gray-900'>Notes</h1>
            <button className='p-2 hover:bg-gray-100 rounded-lg'>
              <Plus className='w-5 h-5 text-gray-600' />
            </button>
          </div>
          <div className='relative'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search notes...'
              className='w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
            />
          </div>
        </div>
        <nav className='mt-2'>
          {/* Note list items */}
          {[1, 2, 3].map((item) => (
            <div key={item} className='px-4 py-3 hover:bg-gray-100 cursor-pointer'>
              <h3 className='font-medium text-gray-900 mb-1'>Note Title {item}</h3>
              <p className='text-sm text-gray-500 truncate'>
                This is a preview of the note content...
              </p>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col'>
        <header className='h-14 border-b border-gray-200 flex items-center px-4'>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 hover:bg-gray-100 rounded-lg'
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </button>
        </header>
        <div className='flex-1 p-6'>
          <input
            type='text'
            placeholder='Note title'
            className='w-full text-3xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 mb-4'
          />
          <textarea
            placeholder='Start writing your note...'
            className='w-full h-full resize-none border-none focus:outline-none focus:ring-0 text-gray-600'
          />
        </div>
      </main>
    </div>
  );
}

export default App;
