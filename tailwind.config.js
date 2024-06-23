/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      
      },
    },
    extend: {
      colors: {
        'primary-500': '#219EBC',
        'primary-600': '#1E8CAB', // Slightly darker than primary-500
        'secondary-500': '#FFB620', // Complementary to primary color for contrast
        'off-white': '#D0EFFF', // A light, cool color that complements primary-500
        'red': '#FF5A5A', // A vibrant, contrasting color for alerts or important highlights
        'red-dark': '#FF4E4E', // A vibrant, contrasting color for alerts or important highlights
        'dark-1': '#000000', // Black for strong contrast
        'dark-2': '#121212', // Very dark grey for less stark contrast than black
        'dark-3': '#1C1C1E', // Dark grey with a hint of blue for a more cohesive look
        'dark-4': '#2A2A2E', // Dark grey with a slight blue tint
        'light-1': '#FFFFFF', // Pure white for strong contrast
        'light-2': '#F0F4F8', // Very light grey with a blue tint
        'light-3': '#A3BCCF', // Light grey-blue for subtle contrast
        'light-4': '#8299B1', // Medium grey-blue for a balanced look
      },
      screens: {
        'xs': '480px',
      
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};