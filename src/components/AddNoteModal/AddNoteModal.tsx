import { NoteServiceError } from '@/services/noteService';
import { defaultThemes, useThemeStore } from '@/store/useThemeStore';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Feedback } from '../ui/Feedback';
import { useFontStore } from '@/store/useFontStore';

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
  const [validation, setValidation] = useState<ValidationState>({
    title: { isValid: true, message: '' },
    content: { isValid: true, message: '' },
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');
  const { theme } = useThemeStore();
  const { font } = useFontStore();

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setSelectedTags([]);
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
    if (existingNotes.some((note) => note.title.toLowerCase() === title.toLowerCase())) {
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
    setValidation((prev) => ({
      ...prev,
      title: validateTitle(newTitle),
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setValidation((prev) => ({
      ...prev,
      content: validateContent(newContent),
    }));
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 top-[10%] mx-auto max-w-2xl overflow-hidden rounded-lg bg-background-light p-6 shadow-xl transition-all dark:bg-background-dark
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <div className="absolute right-0 top-0 pr-4 pt-4">
          <button
            type="button"
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3
            className="text-lg font-medium leading-6 text-text-light dark:text-text-dark"
            style={{ fontFamily: font }}
          >
            Create New Note
          </h3>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-text-light dark:text-text-dark"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm ${
                    !validation.title.isValid ? 'border-red-500' : ''
                  }`}
                />
                {!validation.title.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validation.title.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-text-light dark:text-text-dark"
                >
                  Content
                </label>
                <textarea
                  name="content"
                  id="content"
                  rows={4}
                  value={content}
                  onChange={handleContentChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm ${
                    !validation.content.isValid ? 'border-red-500' : ''
                  }`}
                />
                {!validation.content.isValid && (
                  <p className="mt-1 text-sm text-red-600">{validation.content.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark">
                  Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Feedback show={showFeedback} type={feedbackType} message={feedbackMessage} />
    </>
  );
};
