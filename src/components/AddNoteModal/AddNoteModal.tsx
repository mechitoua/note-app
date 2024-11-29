import { NoteServiceError } from '@/services/noteService';
import { useFontStore } from '@/store/useFontStore';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; content: string; tags: string[] }) => Promise<void>;
  availableTags: string[];
  existingNotes: { title: string }[];
}

interface ValidationState {
  title: {
    isValid: boolean;
    message: string;
  };
  content: {
    isValid: boolean;
    message: string;
  };
}

const getErrorMessage = (error: unknown): { message: string; type: 'error' | 'warning' } => {
  if (error instanceof NoteServiceError) {
    switch (error.type) {
      case 'VALIDATION_ERROR':
        return {
          message: `Please check your input: ${error.message}`,
          type: 'warning',
        };
      case 'DUPLICATE_ERROR':
        return {
          message: error.message,
          type: 'warning',
        };
      case 'STORAGE_ERROR':
        return {
          message: 'Unable to save note. Please try again.',
          type: 'error',
        };
      default:
        return {
          message: error.message,
          type: 'error',
        };
    }
  }
  return {
    message: 'An unexpected error occurred.',
    type: 'error',
  };
};

export const AddNoteModal = ({
  isOpen,
  onClose,
  onSave,
  availableTags,
  existingNotes,
}: AddNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState('');
  const [validation, setValidation] = useState<ValidationState>({
    title: { isValid: true, message: '' },
    content: { isValid: true, message: '' },
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');
  const font = useFontStore(state => state.currentFont);
  const isDark = useThemeStore(state => state.isDark);
  const currentTheme = useThemeStore(state => state.currentTheme);
  const theme = defaultThemes[currentTheme];

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setCustomTags('');
      setValidation({
        title: { isValid: true, message: '' },
        content: { isValid: true, message: '' },
      });
    }
  }, [isOpen]);

  const validateTitle = (title: string) => {
    if (!title.trim()) {
      return { isValid: false, message: 'Title is required' };
    }
    if (existingNotes.some(note => note.title.toLowerCase() === title.toLowerCase())) {
      return { isValid: false, message: 'A note with this title already exists' };
    }
    return { isValid: true, message: '' };
  };

  const validateContent = (content: string) => {
    if (!content.trim()) {
      return { isValid: false, message: 'Content is required' };
    }
    return { isValid: true, message: '' };
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setValidation(prev => ({
      ...prev,
      title: validateTitle(newTitle),
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setValidation(prev => ({
      ...prev,
      content: validateContent(newContent),
    }));
  };

  const handleCustomTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTags(e.target.value);
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newTag = customTags.trim();
      if (newTag) {
        setSelectedTags(prev => [...prev, newTag]);
        setCustomTags('');
      }
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleValidation = validateTitle(title);
    const contentValidation = validateContent(content);

    setValidation({
      title: titleValidation,
      content: contentValidation,
    });

    if (!titleValidation.isValid || !contentValidation.isValid) {
      return;
    }

    try {
      await onSave({ title, content, tags: selectedTags });
      setShowFeedback(true);
      setFeedbackMessage('Note created successfully');
      setFeedbackType('success');
      onClose();
    } catch (error) {
      const { message, type } = getErrorMessage(error);
      setShowFeedback(true);
      setFeedbackMessage(message);
      setFeedbackType(type);
    }

    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto ${isDark ? 'dark' : ''}`}
          style={{ fontFamily: font.fontFamily }}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75"
              onClick={onClose}
            />

            {/* Modal panel */}
            <div
              className={`inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle ${theme.colors.ring}`}
              style={{ fontFamily: font.fontFamily }}
            >
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className={`rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:text-gray-400 focus:${theme.colors.ring}`}
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className={`text-lg font-medium leading-6 ${theme.colors.text}`}>
                    Create New Note
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="title"
                            className={`block text-sm font-medium ${theme.colors.textSecondary}`}
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            className={`mt-1 block w-full rounded-md border ${
                              !validation.title.isValid
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            } bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:${
                              theme.colors.ring
                            } dark:bg-gray-700 dark:text-gray-100 sm:text-sm`}
                            placeholder="Enter note title"
                          />
                          {!validation.title.isValid && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {validation.title.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="content"
                            className={`block text-sm font-medium ${theme.colors.textSecondary}`}
                          >
                            Content
                          </label>
                          <textarea
                            id="content"
                            name="content"
                            rows={4}
                            value={content}
                            onChange={handleContentChange}
                            className={`mt-1 block w-full rounded-md border ${
                              !validation.content.isValid
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            } bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:${
                              theme.colors.ring
                            } dark:bg-gray-700 dark:text-gray-100 sm:text-sm`}
                            placeholder="Enter note content"
                          />
                          {!validation.content.isValid && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {validation.content.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="customTags"
                            className={`block text-sm font-medium ${theme.colors.textSecondary}`}
                          >
                            Add Custom Tags
                          </label>
                          <input
                            type="text"
                            id="customTags"
                            name="customTags"
                            value={customTags}
                            onChange={handleCustomTagsChange}
                            onKeyDown={handleCustomTagKeyDown}
                            className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:${theme.colors.ring} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 sm:text-sm`}
                            placeholder="Type a tag and press Enter"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="tags"
                            className={`block text-sm font-medium ${theme.colors.textSecondary}`}
                          >
                            Available Tags
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagSelect(tag)}
                                className={`rounded-full px-3 py-1 text-sm ${
                                  selectedTags.includes(tag)
                                    ? `${theme.colors.primaryLight} ${theme.colors.accent}`
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          {selectedTags.length > 0 && (
                            <div className="mt-2">
                              <label
                                className={`block text-sm font-medium ${theme.colors.textSecondary}`}
                              >
                                Selected Tags
                              </label>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                  <span
                                    key={tag}
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${theme.colors.primaryLight} ${theme.colors.accent}`}
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleTagRemove(tag)}
                                      className={`ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full ${theme.colors.hover}`}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {showFeedback && (
                        <div
                          className={`mt-4 rounded-md p-4 ${
                            feedbackType === 'error'
                              ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                              : feedbackType === 'warning'
                                ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
                                : 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                          }`}
                        >
                          {feedbackMessage}
                        </div>
                      )}

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:${theme.colors.ring} sm:col-start-2 sm:text-sm ${theme.colors.primary}`}
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className={`mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:${theme.colors.ring} sm:col-start-1 sm:mt-0 sm:text-sm ${theme.colors.border} bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
