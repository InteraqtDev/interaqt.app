/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      }
    }
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}

