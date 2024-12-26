/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-pink-1': '#EEC6CC', 
        'custom-pink-2': '#e05170',
        'custom-gray': 'rgb(204, 206, 199)', 
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
      }

    },
  },
  plugins: [],
}