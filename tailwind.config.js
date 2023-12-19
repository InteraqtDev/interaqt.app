/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
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

