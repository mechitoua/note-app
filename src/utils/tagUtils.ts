export const formatTag = (tag: string): string => {
  return tag.trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const normalizeTag = (tag: string): string => {
  return tag.trim().toLowerCase();
};
