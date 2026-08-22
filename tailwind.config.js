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
          DEFAULT: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        surface: {
          page: '#F9FAFB',
          card: '#FFFFFF',
          sidebar: '#0B0F17',
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
          amber: '#EA580C',
        }
      },
    },
  },
  plugins: [],
}
