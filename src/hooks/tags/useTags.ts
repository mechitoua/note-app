import { useState, useCallback } from 'react';
import { Note } from '@/types/note';

export const useTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const syncTags = useCallback((notes: Note[]) => {
    const uniqueTags = new Set<string>();
    notes.forEach(note => {
      note.tags?.forEach(tag => uniqueTags.add(tag));
    });
    setTags(Array.from(uniqueTags));
  }, []);

  const addTags = useCallback((newTags: string[]) => {
    setTags(prevTags => {
      const uniqueTags = new Set([...prevTags, ...newTags]);
      return Array.from(uniqueTags);
    });
  }, []);

  const clearSelectedTag = useCallback(() => {
    setSelectedTag(null);
  }, []);

  const getAllTags = useCallback(() => {
    return tags;
  }, [tags]);

  return {
    tags,
    selectedTag,
    setSelectedTag,
    addTags,
    syncTags,
    clearSelectedTag,
    getAllTags,
  };
};
