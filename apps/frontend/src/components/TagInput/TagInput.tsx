import { Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface TagInputProps {
  availableTags: string[];
  onAddTag: (tag: string) => void;
  className?: string;
}

export const TagInput = ({ availableTags, onAddTag, className = '' }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = availableTags.filter(tag =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      tag.toLowerCase() !== inputValue.toLowerCase()
    );
    setSuggestions(filtered);
  }, [inputValue, availableTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleAddTag(suggestions[selectedSuggestionIndex]);
      } else if (inputValue.trim()) {
        handleAddTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleAddTag = (tag: string) => {
    onAddTag(tag);
    setInputValue('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Add a tag..."
          className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
        <button
          onClick={() => inputValue.trim() && handleAddTag(inputValue.trim())}
          disabled={!inputValue.trim()}
          className="flex items-center justify-center p-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleAddTag(suggestion)}
              className={`w-full text-left px-3 py-1.5 text-xs ${
                index === selectedSuggestionIndex
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
