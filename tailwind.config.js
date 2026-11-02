/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',
          light: '#232F3E',
          orange: '#FF9900',
          yellow: '#FFD814',
          yellowHover: '#F7CA00',
          blue: '#007185',
          price: '#B12704'
        }
      }
    },
  },
  plugins: [],
}
