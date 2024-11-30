export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export type CurrentView = 'all-notes' | 'archived' | 'editor' | 'search' | 'new-note';
