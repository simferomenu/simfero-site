/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBlue: '#161B21',
        gold: '#D2AF96',
        darkGold: '#ab907c'
      },
      fontFamily: {
        Segoe: ['Segoe UI'],
        Sitka: ['Sitka Banner']
      }
    }
  },
  plugins: []
}
