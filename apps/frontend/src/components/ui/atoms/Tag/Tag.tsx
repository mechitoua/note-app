import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export const Tag = ({ className, children, onRemove, variant = 'default', ...props }: TagProps) => {
  const variants = {
    default: 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white',
    primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn('w-3.5 h-3.5 rounded hover:bg-black/10 dark:hover:bg-white/10 inline-flex items-center justify-center')}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
};
