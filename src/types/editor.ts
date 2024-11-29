export interface EditorContent {
  title: string;
  content: string;
  tags: string[];
}

export type EditorMode = 'create' | 'edit' | 'view';
