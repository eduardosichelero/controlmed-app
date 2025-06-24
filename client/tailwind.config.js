// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '768px',
      'tablet': '1000px',
      'hd': '1366px', 
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  plugins: [],
};