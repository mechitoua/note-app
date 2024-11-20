import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState = ({ onCreateNote }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900">
      <div className="text-center p-6">
        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Notes Yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Create your first note to get started
        </p>
        <button
          onClick={onCreateNote}
          className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Note
        </button>
      </div>
    </div>
  );
};
