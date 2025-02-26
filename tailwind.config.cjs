/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5'
        },
        secondary: {
          DEFAULT: '#f472b6',
          dark: '#db2777'
        }
      }
    }
  },
  plugins: []
}
