import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = string;
export type Theme = {
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    hover: string;
    border: string;
  };
};

export const defaultThemes: Record<ThemeName, Theme> = {
  navy: {
    name: 'Navy',
    colors: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      primaryLight: 'bg-blue-50 dark:bg-blue-900/30',
      secondary: 'bg-blue-500 hover:bg-blue-600',
      accent: 'text-blue-600',
      background: 'bg-blue-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-blue-100',
      border: 'border-blue-200',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: 'bg-emerald-600 hover:bg-emerald-700',
      primaryLight: 'bg-emerald-50 dark:bg-emerald-900/30',
      secondary: 'bg-emerald-500 hover:bg-emerald-600',
      accent: 'text-emerald-600',
      background: 'bg-emerald-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-emerald-100',
      border: 'border-emerald-200',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: 'bg-orange-500 hover:bg-orange-600',
      primaryLight: 'bg-orange-50 dark:bg-orange-900/30',
      secondary: 'bg-orange-400 hover:bg-orange-500',
      accent: 'text-orange-500',
      background: 'bg-orange-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-orange-100',
      border: 'border-orange-200',
    },
  },
  lavender: {
    name: 'Lavender',
    colors: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      primaryLight: 'bg-purple-50 dark:bg-purple-900/30',
      secondary: 'bg-purple-500 hover:bg-purple-600',
      accent: 'text-purple-600',
      background: 'bg-purple-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-purple-100',
      border: 'border-purple-200',
    },
  },
  rose: {
    name: 'Rose',
    colors: {
      primary: 'bg-pink-600 hover:bg-pink-700',
      primaryLight: 'bg-pink-50 dark:bg-pink-900/30',
      secondary: 'bg-pink-500 hover:bg-pink-600',
      accent: 'text-pink-600',
      background: 'bg-pink-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-pink-100',
      border: 'border-pink-200',
    },
  },
  slate: {
    name: 'Slate',
    colors: {
      primary: 'bg-slate-600 hover:bg-slate-700',
      primaryLight: 'bg-slate-50 dark:bg-slate-900/30',
      secondary: 'bg-slate-500 hover:bg-slate-600',
      accent: 'text-slate-600',
      background: 'bg-slate-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-slate-100',
      border: 'border-slate-200',
    },
  },
};

type ThemeStore = {
  isDark: boolean;
  currentTheme: string;
  setIsDark: (isDark: boolean) => void;
  setCurrentTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      currentTheme: 'navy', // Default theme
      setIsDark: (isDark) => set({ isDark }),
      setCurrentTheme: (theme) => {
        // Only set theme if it exists in defaultThemes
        if (defaultThemes[theme]) {
          set({ currentTheme: theme });
        } else {
          set({ currentTheme: 'navy' }); // Fallback to navy theme
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Validate theme on storage rehydration
        if (state && !defaultThemes[state.currentTheme]) {
          state.currentTheme = 'navy';
        }
      },
    }
  )
);
