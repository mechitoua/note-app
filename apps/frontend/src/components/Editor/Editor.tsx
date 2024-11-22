import { Button } from '@/components/ui/atoms';
import { Note } from '@/types/note';
import { Archive, Save, Trash, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Categories, type Category } from '../Categories/Categories';
import { cn } from '@/lib/utils';

interface EditorProps {
  note: Note | null;
  content: {
    title: string;
    content: string;
  };
  onUpdate: (note: { title: string; content: string; tags: string[] }) => void;
  onDelete: () => void;
  onArchive: () => void;
}

export const Editor = ({ note, content, onUpdate, onDelete, onArchive }: EditorProps) => {
  const [title, setTitle] = useState(content.title);
  const [noteContent, setNoteContent] = useState(content.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample categories - you can move this to your store later
  const categories: Category[] = [
    { id: '1', name: 'Personal', color: '#f87171' },
    { id: '2', name: 'Work', color: '#60a5fa' },
    { id: '3', name: 'Ideas', color: '#34d399' },
    { id: '4', name: 'Tasks', color: '#fbbf24' },
  ];

  useEffect(() => {
    setTitle(content.title);
    setNoteContent(content.content);
  }, [content]);

  const handleSave = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      await onUpdate({
        title,
        content: noteContent,
        tags: note.tags || [],
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!note) {
    return (
      <div className='h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800'>
        <div className='text-center'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Select a Note</h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Choose a note from the sidebar or create a new one to begin editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-white dark:bg-gray-900'>
      <div className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
        <div className='pl-0 pr-2 py-3 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsActionsVisible(!isActionsVisible)}
              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-1'
              title={isActionsVisible ? 'Hide actions' : 'Show actions'}
            >
              {isActionsVisible ? (
                <ChevronRight className='h-4 w-4 text-gray-500 dark:text-gray-400' />
              ) : (
                <ChevronLeft className='h-4 w-4 text-gray-500 dark:text-gray-400' />
              )}
            </button>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Note title'
              className='flex-1 bg-transparent border-0 text-lg font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none'
            />
          </div>
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${isActionsVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
            <Button variant='ghost' onClick={onArchive} title='Archive Note'>
              <Archive className='h-4 w-4' />
            </Button>
            <Button variant='ghost' onClick={onDelete} title='Delete Note'>
              <Trash className='h-4 w-4' />
            </Button>
            <Button variant='primary' size='sm' onClick={handleSave} disabled={isSaving}>
              <Save className='h-4 w-4 mr-2' />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
      <div className='flex-1 flex flex-col'>
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            className={cn(
              'justify-start',
              !isActionsVisible && !selectedCategory && 'bg-accent'
            )}
            onClick={() => {
              setIsActionsVisible(false);
              setSelectedCategory(null);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            All Notes
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'justify-start',
              isActionsVisible && 'bg-accent'
            )}
            onClick={() => {
              setIsActionsVisible(true);
              setSelectedCategory(null);
            }}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archived
          </Button>
          
          <div className="pt-2">
            <Categories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder='Start writing your note...'
          className='w-full h-full min-h-[calc(100vh-10rem)] bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none resize-none'
        />
      </div>
    </div>
  );
};
