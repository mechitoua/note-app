import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackProps {
  show: boolean;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export const Feedback = ({ show, type, message }: FeedbackProps) => {
  if (!show) return null;

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        transform transition-all duration-300 ease-out
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <div
        className={`rounded-lg p-4 ${
          type === 'success' ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'
        }`}
      >
        <div className="flex items-center">
          {type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
          <p
            className={`ml-3 text-sm font-medium ${
              type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
