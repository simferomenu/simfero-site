/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '860px',
      sm: '1024px',
      md: '1112px',
      lg: '1194px',
      xl: '1366px'
    },
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
