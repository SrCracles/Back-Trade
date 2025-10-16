/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e27',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          purple: '#8b5cf6',
          orange: '#f97316',
          yellow: '#eab308',
        }
      }
    },
  },
  plugins: [],
}

