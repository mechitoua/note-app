/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/frontend/index.html',
    './apps/frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        'sidebar-bg': '#f8fafc',
      },
    },
  },
  plugins: [],
};
