export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateNoteInput {
  id: number;
  title?: string;
  content?: string;
  tags?: string[];
  isArchived?: boolean;
}
