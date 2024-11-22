import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeName = string
export type Theme = {
  name: string
  colors: {
    primary: string
    primaryLight: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    hover: string
    border: string
  }
}

export const defaultThemes: Record<ThemeName, Theme> = {
  navy: {
    name: 'Navy',
    colors: {
      primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-300 dark:hover:bg-blue-400',
      primaryLight: 'bg-blue-50 dark:bg-blue-900/50',
      secondary: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-200 dark:hover:bg-blue-300',
      accent: 'text-blue-600 dark:text-blue-300',
      background: 'bg-blue-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900',
      border: 'border-blue-200 dark:border-blue-800',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-300 dark:hover:bg-emerald-400',
      primaryLight: 'bg-emerald-50 dark:bg-emerald-900/50',
      secondary: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-200 dark:hover:bg-emerald-300',
      accent: 'text-emerald-600 dark:text-emerald-300',
      background: 'bg-emerald-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-200 dark:hover:bg-orange-300',
      primaryLight: 'bg-orange-50 dark:bg-orange-900/50',
      secondary: 'bg-orange-400 hover:bg-orange-500 dark:bg-orange-100 dark:hover:bg-orange-200',
      accent: 'text-orange-500 dark:text-orange-300',
      background: 'bg-orange-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900',
      border: 'border-orange-200 dark:border-orange-800',
    },
  },
  lavender: {
    name: 'Lavender',
    colors: {
      primary: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-300 dark:hover:bg-purple-400',
      primaryLight: 'bg-purple-50 dark:bg-purple-900/50',
      secondary: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-200 dark:hover:bg-purple-300',
      accent: 'text-purple-600 dark:text-purple-300',
      background: 'bg-purple-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900',
      border: 'border-purple-200 dark:border-purple-800',
    },
  },
  rose: {
    name: 'Rose',
    colors: {
      primary: 'bg-pink-600 hover:bg-pink-700 dark:bg-pink-300 dark:hover:bg-pink-400',
      primaryLight: 'bg-pink-50 dark:bg-pink-900/50',
      secondary: 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-200 dark:hover:bg-pink-300',
      accent: 'text-pink-600 dark:text-pink-300',
      background: 'bg-pink-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-pink-100 dark:hover:bg-pink-900',
      border: 'border-pink-200 dark:border-pink-800',
    },
  },
  slate: {
    name: 'Slate',
    colors: {
      primary: 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-400',
      primaryLight: 'bg-slate-50 dark:bg-slate-900/50',
      secondary: 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-200 dark:hover:bg-slate-300',
      accent: 'text-slate-600 dark:text-slate-300',
      background: 'bg-slate-50 dark:bg-slate-950',
      surface: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-slate-50',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      hover: 'hover:bg-slate-100 dark:hover:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
    },
  },
}

type ThemeStore = {
  isDark: boolean
  currentTheme: string
  setIsDark: (isDark: boolean) => void
  setCurrentTheme: (theme: string) => void
}

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
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Validate theme on storage rehydration
        if (state && !defaultThemes[state.currentTheme]) {
          state.currentTheme = 'navy';
        }
      }
    }
  )
)
