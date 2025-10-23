/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c1121f', // deep red
        accent: '#f4f4f4',
        dark: '#1a1a1a'
      },
    },
  },
  plugins: [],
};
