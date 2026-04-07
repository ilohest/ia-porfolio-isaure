/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        panel: '#161b27',
        border: '#1e2535',
        accent: '#c9a84c',
        'accent-dim': '#8a6d2f',
        muted: '#4a5568',
        subtle: '#2d3748',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
