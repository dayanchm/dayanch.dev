/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  darkMode: 'class',
  content: [
    './[lng]/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './[lng]/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './App.jsx'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#18191F",
        accent: "#f59e0b",
        surface: "#1e1f26",
        border: "#2d2e36",
      },
    },
  },
  plugin: [
  plugin(({ matchUtilities }) => {
    matchUtilities({
      perspective: (value) => ({
        perspective: value,
      }),
    });
  }),
],
}
