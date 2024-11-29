import { Tag } from '@/components/ui/atoms';
import { cn } from '@/lib/utils';
import { Note } from '@/types/note';

export interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NoteCard = ({ note, isSelected, onClick, className }: NoteCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-lg border cursor-pointer transition-all duration-200',
        {
          'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50': isSelected,
          'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700':
            !isSelected,
        },
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-snug overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
          {note.title || 'Untitled Note'}
        </h3>
        {!note.archived && note.content && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 h-5">
            {note.content.replace(/[#*`_[\]()]/g, '')}
          </p>
        )}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};
