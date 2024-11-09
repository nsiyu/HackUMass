/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        oxygen: ['Oxygen', 'sans-serif'],
      },
      colors: {
        'light-coral': '#f08080',
        'coral-pink': '#f4978e',
        'melon': '#f8ad9d',
        'apricot': '#fbc4ab',
        'light-orange': '#ffdab9',
      },
      backgroundImage: {
        'gradient-coral': 'linear-gradient(45deg, rgba(240, 128, 128, 0.1), rgba(244, 151, 142, 0.1), rgba(248, 173, 157, 0.1), rgba(251, 196, 171, 0.1), rgba(255, 218, 185, 0.1))',
      }
    },
  },
  plugins: [],
}