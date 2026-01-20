/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',      // Netflix signature red
          darkRed: '#B20710',  // Darker red for hover
          black: '#141414',    // Netflix dark background
          darkGray: '#221F1F', // Secondary dark
          lightGray: '#757575', // Text gray
        },
      },
    },
  },
  plugins: [],
}

