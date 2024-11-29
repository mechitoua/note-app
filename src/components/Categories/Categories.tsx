import { useState } from 'react';
import { ChevronDown, ChevronUp, FolderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Category = {
  id: string;
  name: string;
  color?: string;
};

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const Categories = ({ categories, selectedCategory, onSelectCategory }: CategoriesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <div className="flex items-center gap-2">
          <FolderIcon className="w-4 h-4" />
          <span>Categories</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="flex flex-col space-y-1 mt-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() =>
                onSelectCategory(category.id === selectedCategory ? null : category.id)
              }
              className={cn(
                'flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                selectedCategory === category.id
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300'
              )}
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: category.color || '#94a3b8' }}
              />
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
