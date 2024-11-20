export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  archived?: boolean;
}
