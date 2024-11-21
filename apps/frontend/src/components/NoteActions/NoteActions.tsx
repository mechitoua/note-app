import { Archive, Clock, Tag, Trash2, X } from 'lucide-react';
import { Note } from '@/types/note';
import { TagInput } from '../TagInput/TagInput';
import { useNoteStore } from '@/store/useNoteStore';
import { useState, useEffect } from 'react';

interface NoteActionsProps {
  selectedNote: Note;
  onArchive: () => void;
  onDelete: () => void;
  onAddTags?: (tags: string[]) => void;
  onUpdateTags?: (tags: string[]) => void;
  availableTags: string[];
}

export const NoteActions = ({ 
  selectedNote, 
  onArchive, 
  onDelete, 
  onAddTags, 
  onUpdateTags,
  availableTags 
}: NoteActionsProps) => {
  // Local state to immediately reflect tag changes
  const [localTags, setLocalTags] = useState(selectedNote.tags || []);

  // Sync local tags when selected note changes
  useEffect(() => {
    setLocalTags(selectedNote.tags || []);
  }, [selectedNote]);

  const handleAddTag = async (tag: string) => {
    if (!onAddTags) return;
    
    // Update local state immediately
    const newTags = [...localTags, tag];
    setLocalTags(newTags);
    
    // Update backend
    await onAddTags([tag]);
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!onUpdateTags) return;
    
    // Update local state immediately
    const newTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(newTags);
    
    // Update backend with complete new tag list
    await onUpdateTags(newTags);
  };

  return (
    <div className='col-span-1 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
      <div className='h-full p-3 space-y-4'>
        {/* Note Info Section */}
        <div className='space-y-3'>
          <div className='flex items-start gap-2'>
            <Tag className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <div className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5'>Tags</div>
              <div className='flex flex-wrap gap-1'>
                {localTags.length > 0 ? (
                  localTags.map((tag) => (
                    <span
                      key={tag}
                      className='px-1.5 py-0.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-medium truncate group flex items-center gap-1'
                    >
                      {tag}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(tag);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 hover:text-gray-900 dark:hover:text-gray-100" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className='text-xs text-gray-500 dark:text-gray-400'>No tags</span>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-start gap-2'>
            <Clock className='w-3.5 h-3.5 text-gray-600 dark:text-gray-400 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <div className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>Last edited</div>
              <div className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                {new Date(selectedNote.updatedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className='pt-4'>
          <div className='space-y-2'>
            <button
              onClick={onArchive}
              className='w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-xs'
            >
              <Archive className='w-3.5 h-3.5' />
              {selectedNote.archived ? 'Unarchive' : 'Archive'}
            </button>
            <button
              onClick={onDelete}
              className='w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-xs'
            >
              <Trash2 className='w-3.5 h-3.5' />
              Delete
            </button>
          </div>
        </div>

        {onAddTags && (
          <div className='pt-4'>
            <div className='space-y-2'>
              <TagInput
                availableTags={availableTags}
                onAddTag={handleAddTag}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
