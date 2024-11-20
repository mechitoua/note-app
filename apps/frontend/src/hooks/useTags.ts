import { useState, useCallback } from 'react';

export const useTags = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const addTag = useCallback((tag: string) => {
    setTags(prev => {
      if (!prev.includes(tag)) {
        return [...prev, tag];
      }
      return prev;
    });
  }, []);

  const addTags = useCallback((newTags: string[]) => {
    setTags(prev => {
      const uniqueTags = new Set([...prev, ...newTags]);
      return Array.from(uniqueTags);
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  const clearSelectedTag = useCallback(() => {
    setSelectedTag(null);
  }, []);

  return {
    tags,
    selectedTag,
    setSelectedTag,
    addTag,
    addTags,
    removeTag,
    clearSelectedTag,
  };
};
