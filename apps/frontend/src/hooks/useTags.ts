import { useState, useCallback, useEffect } from 'react';
import { Note } from '@/types/note';
import { DEFAULT_TAGS, isDefaultTag } from '@/constants/defaultTags';

// Helper function to normalize tag case
const normalizeTag = (tag: string) => tag.toLowerCase().trim();

export const useTags = () => {
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Combine default and custom tags
  const tags = [...DEFAULT_TAGS, ...customTags];

  const addTag = useCallback((tag: string) => {
    const normalizedTag = normalizeTag(tag);
    // Don't add if it's a default tag or already exists (case insensitive)
    if (isDefaultTag(tag) || customTags.some(t => normalizeTag(t) === normalizedTag)) {
      return;
    }
    setCustomTags(prev => [...prev.filter(t => normalizeTag(t) !== normalizedTag), normalizedTag]);
  }, [customTags]);

  const addTags = useCallback((newTags: string[]) => {
    setCustomTags(prev => {
      const uniqueTags = new Map<string, string>(); // normalized -> original
      
      // Add existing tags first
      prev.forEach(tag => {
        uniqueTags.set(normalizeTag(tag), tag);
      });

      // Add new tags, skipping duplicates and default tags
      newTags.forEach(tag => {
        const normalizedTag = normalizeTag(tag);
        if (!isDefaultTag(tag) && !uniqueTags.has(normalizedTag)) {
          uniqueTags.set(normalizedTag, normalizedTag);
        }
      });

      return Array.from(uniqueTags.values());
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    // Don't remove default tags
    if (isDefaultTag(tag)) {
      return;
    }
    const normalizedTag = normalizeTag(tag);
    setCustomTags(prev => prev.filter(t => normalizeTag(t) !== normalizedTag));
  }, []);

  const clearSelectedTag = useCallback(() => {
    setSelectedTag(null);
  }, []);

  const syncTags = useCallback((notes: Note[]) => {
    const allTags = new Set<string>();
    
    // Collect all unique tags from notes
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        if (!isDefaultTag(tag)) {
          allTags.add(normalizeTag(tag));
        }
      });
    });

    setCustomTags(Array.from(allTags));
  }, []);

  return {
    tags,
    selectedTag,
    setSelectedTag,
    addTag,
    addTags,
    removeTag,
    clearSelectedTag,
    syncTags,
  };
};
