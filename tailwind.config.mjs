/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/frontend/index.html',
    './apps/frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        primary: '#4F46E5',
        secondary: '#64748b',
        accent: '#4F46E5',
        'sidebar-bg': {
          light: '#f8fafc',
          dark: '#262626',
        },
        'accent-light': '#6366F1',
        'accent-dark': '#4338CA',
        'text': {
          light: '#18181b',
          dark: '#f4f4f5',
        },
      },
    },
  },
  plugins: [],
};
