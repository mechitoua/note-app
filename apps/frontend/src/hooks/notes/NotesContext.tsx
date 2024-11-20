import { createContext, useContext, ReactNode } from 'react';
import { useNotes } from './useNotes';

const NotesContext = createContext<ReturnType<typeof useNotes> | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const notes = useNotes();
  return <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};
