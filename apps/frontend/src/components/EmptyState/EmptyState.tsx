import { FileText } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900">
      <div className="text-center p-6">
        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Note Selected</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a note from the list to view or edit its content
        </p>
      </div>
    </div>
  );
};
