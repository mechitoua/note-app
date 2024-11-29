import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontTheme = {
  fontFamily: string;
  displayName: string;
  category?: 'sans-serif' | 'monospace' | 'decorative';
};

export const fontThemes: FontTheme[] = [
  // System & Sans-serif fonts
  {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    displayName: 'System Default',
    category: 'sans-serif',
  },
  { fontFamily: 'Inter, sans-serif', displayName: 'Inter', category: 'sans-serif' },
  { fontFamily: 'Roboto, sans-serif', displayName: 'Roboto', category: 'sans-serif' },
  { fontFamily: 'Poppins, sans-serif', displayName: 'Poppins', category: 'sans-serif' },
  {
    fontFamily: '"IBM Plex Sans", sans-serif',
    displayName: 'IBM Plex Sans',
    category: 'sans-serif',
  },
  {
    fontFamily: '"Source Sans Pro", sans-serif',
    displayName: 'Source Sans Pro',
    category: 'sans-serif',
  },
  { fontFamily: '"DM Sans", sans-serif', displayName: 'DM Sans', category: 'sans-serif' },
  { fontFamily: '"DM Serif Text", serif', displayName: 'DM Serif Text', category: 'sans-serif' },

  // Monospace fonts
  {
    fontFamily: '"JetBrains Mono", monospace',
    displayName: 'JetBrains Mono',
    category: 'monospace',
  },
  {
    fontFamily: '"Cascadia Code", "JetBrains Mono", monospace',
    displayName: 'Cascadia Code',
    category: 'monospace',
  },
  { fontFamily: '"Fragment Mono", monospace', displayName: 'Fragment Mono', category: 'monospace' },

  // Decorative fonts
  { fontFamily: 'Cookie, cursive', displayName: 'Cookie', category: 'decorative' },
  { fontFamily: '"Moon Dance", cursive', displayName: 'Moon Dance', category: 'decorative' },
  { fontFamily: '"Indie Flower", cursive', displayName: 'Indie Flower', category: 'decorative' },
  { fontFamily: '"Patrick Hand", cursive', displayName: 'Patrick Hand', category: 'decorative' },
];

interface FontState {
  currentFont: FontTheme;
  setFont: (font: FontTheme) => void;
}

export const useFontStore = create<FontState>()(
  persist(
    set => ({
      currentFont: fontThemes[0],
      setFont: (font: FontTheme) => set({ currentFont: font }),
    }),
    {
      name: 'font-storage',
    }
  )
);
