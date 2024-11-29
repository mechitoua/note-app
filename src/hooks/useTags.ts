import { DEFAULT_TAGS, isDefaultTag } from '@/constants/defaultTags';
import { Note } from '@/types/note';
import { formatTag, normalizeTag } from '@/utils/tagUtils';
import { useCallback, useState } from 'react';

export const useTags = () => {
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Combine default and custom tags
  const tags = [...DEFAULT_TAGS, ...customTags];

  const addTag = useCallback(
    (tag: string) => {
      const normalized = normalizeTag(tag);
      // Don't add if it's a default tag or already exists (case insensitive)
      if (isDefaultTag(tag) || customTags.some(t => normalizeTag(t) === normalized)) {
        return;
      }
      setCustomTags(prev => [...prev.filter(t => normalizeTag(t) !== normalized), formatTag(tag)]);
    },
    [customTags]
  );

  const addTags = useCallback((newTags: string[]) => {
    setCustomTags(prev => {
      const uniqueTags = new Map<string, string>(); // normalized -> formatted

      // Add existing tags first
      prev.forEach(tag => {
        uniqueTags.set(normalizeTag(tag), tag);
      });

      // Add new tags, skipping duplicates and default tags
      newTags.forEach(tag => {
        const normalized = normalizeTag(tag);
        if (!isDefaultTag(tag) && !uniqueTags.has(normalized)) {
          uniqueTags.set(normalized, formatTag(tag));
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
    const normalized = normalizeTag(tag);
    setCustomTags(prev => prev.filter(t => normalizeTag(t) !== normalized));
  }, []);

  const clearSelectedTag = useCallback(() => {
    setSelectedTag(null);
  }, []);

  const syncTags = useCallback((notes: Note[]) => {
    const uniqueTags = new Map<string, string>(); // normalized -> formatted

    // Collect all unique tags from notes
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        if (!isDefaultTag(tag)) {
          const normalized = normalizeTag(tag);
          if (!uniqueTags.has(normalized)) {
            uniqueTags.set(normalized, formatTag(tag));
          }
        }
      });
    });

    setCustomTags(Array.from(uniqueTags.values()));
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
