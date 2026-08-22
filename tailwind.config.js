/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        surface: {
          page: '#F9FAFB',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          topbar: '#FFFFFF',
        },
        border: {
          subtle: '#E5E7EB',
        },
        content: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        status: {
          green: '#059669',
          red: '#DC2626',
          amber: '#D97706',
        }
      },
    },
  },
  plugins: [],
}
