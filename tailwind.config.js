/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f5ff',
          100: '#f1e8ff',
          200: '#e6d5ff',
          300: '#d2b4fe',
          400: '#b784fc',
          500: '#9c55f7',
          600: '#8533ea',
          700: '#7122ce',
          800: '#6121a8',
          900: '#501c87',
          950: '#340764',
        },
      },
    },
  },
  plugins: [],
};


