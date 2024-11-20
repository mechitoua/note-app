/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'borel': ['Borel', 'cursive'],
      },
      colors: {
        background: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        text: {
          light: '#1a1a1a',
          dark: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
