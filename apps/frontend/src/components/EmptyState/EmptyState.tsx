import { FileText } from 'lucide-react';

interface EmptyStateProps {}

export const EmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900'>
      <div className='text-center p-6'>
        <FileText className='w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-1'>No Notes Yet</h3>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Create your first note to get started
        </p>
      </div>
    </div>
  );
};
