// Default tags that will always be available in the sidebar
export const DEFAULT_TAGS = [
  'Work',
  'Personal',
  'Important',
  'Todo',
  'Ideas',
  'Project',
  'Learning',
  'Reference',
] as const;

export type DefaultTag = (typeof DEFAULT_TAGS)[number];

// Function to check if a tag is a default tag
export const isDefaultTag = (tag: string): tag is DefaultTag => {
  return DEFAULT_TAGS.some(defaultTag => defaultTag.toLowerCase() === tag.toLowerCase());
};
