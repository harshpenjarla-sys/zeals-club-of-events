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
        zeal: {
          dark: '#07090e',
          card: '#0f1420',
          cardLight: '#182032',
          border: '#232d42',
          purple: '#8b5cf6',
          purpleGlow: '#a855f7',
          blue: '#3b82f6',
          neonBlue: '#00d2ff',
          magenta: '#ec4899',
          orange: '#f97316',
          gold: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'glow-magenta': '0 0 25px -5px rgba(236, 72, 153, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
