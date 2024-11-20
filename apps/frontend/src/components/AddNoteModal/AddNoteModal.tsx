import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; tags: string[] }) => void;
  availableTags: string[];
}

export const AddNoteModal = ({ isOpen, onClose, onSave, availableTags }: AddNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      tags: selectedTags,
    });
    // Reset form
    setTitle('');
    setNewTag('');
    setSelectedTags([]);
    onClose();
  };

  const handleTagInput = (value: string) => {
    setNewTag(value);
    
    // If the input ends with a comma, add the tag(s)
    if (value.includes(',')) {
      const tagsToAdd = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsToAdd.length > 0) {
        setSelectedTags(prev => {
          const uniqueTags = new Set([...prev, ...tagsToAdd]);
          return Array.from(uniqueTags);
        });
        setNewTag('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tagsToAdd = newTag
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsToAdd.length > 0) {
        setSelectedTags(prev => {
          const uniqueTags = new Set([...prev, ...tagsToAdd]);
          return Array.from(uniqueTags);
        });
        setNewTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                    Add New Note
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 bg-white dark:bg-gray-800"
                      placeholder="Enter note title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Tags
                    </label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => handleTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 bg-white dark:bg-gray-800"
                          placeholder="Type tags separated by commas (e.g., work, todo, important)"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Press Enter or type comma to add tags
                        </p>
                      </div>
                      
                      {/* Selected Tags */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="w-4 h-4 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 inline-flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Available Tags */}
                      {availableTags.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Available tags:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {availableTags
                              .filter(tag => !selectedTags.includes(tag))
                              .map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => setSelectedTags(prev => [...prev, tag])}
                                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {tag}
                                </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
