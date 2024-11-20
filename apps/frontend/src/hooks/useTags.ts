import { useState, useCallback } from 'react';
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
    setSelectedTag(prev => prev && normalizeTag(prev) === normalizedTag ? null : prev);
  }, []);

  const syncTags = useCallback((notes: Note[]) => {
    // Get all unique tags from existing notes (case insensitive)
    const uniqueTags = new Map<string, string>(); // normalized -> original
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        // Only add non-default tags to the sync process
        if (!isDefaultTag(tag)) {
          uniqueTags.set(normalizeTag(tag), normalizeTag(tag));
        }
      });
    });
    
    setCustomTags(Array.from(uniqueTags.values()));
    // If selected tag is not a default tag and no longer exists, clear it
    setSelectedTag(prev => {
      if (prev && !isDefaultTag(prev) && !uniqueTags.has(normalizeTag(prev))) {
        return null;
      }
      return prev;
    });
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
    syncTags,
    clearSelectedTag,
  };
};
