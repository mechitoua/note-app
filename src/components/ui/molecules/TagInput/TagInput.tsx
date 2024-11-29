import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/atoms';
import { Tag } from '@/components/ui/atoms';
import { cn } from '@/lib/utils';

export interface TagInputProps {
  label?: string;
  tags: string[];
  suggestions?: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export const TagInput = ({
  label,
  tags,
  suggestions = [],
  onTagsChange,
  className,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion.toLowerCase())
  );

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="relative">
        <Input
          label={label}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Type and press Enter to add tags..."
          fullWidth
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <ul className="py-1">
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    if (!tags.includes(suggestion.toLowerCase())) {
                      onTagsChange([...tags, suggestion.toLowerCase()]);
                    }
                    setInputValue('');
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag}
            onRemove={() => handleRemoveTag(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};
