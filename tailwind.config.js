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
        primary: {
          cyan: '#06b6d4', // cyan-500
          green: '#22c55e', // green-500
        },
        dark: {
          bg: '#0f172a', // slate-900
          surface: '#1e293b', // slate-800
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #06b6d4, #22c55e)',
      }
    },
  },
  plugins: [],
}
