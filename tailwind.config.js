/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0064FA',   // Brandeis Blue
          secondary: '#91BEFF', // Jordy Blue
          light: '#E1F5FF',     // Light Cyan
          green: '#5AA55A',     // Pastel Green
          darkGreen: '#0F4B2D', // Zucchini Green
        },
        primary: {
          DEFAULT: '#0064FA',
          50: '#F0F7FF',
          100: '#E1F5FF',
          200: '#BAE0FF',
          300: '#91BEFF',
          400: '#4691FF',
          500: '#0064FA',
          600: '#0053D6',
          700: '#003FB3',
          800: '#002E8A',
          900: '#001E61',
        },
        positive: {
          DEFAULT: '#5AA55A',
          50: '#F2F8F2',
          100: '#E2F1E2',
          500: '#5AA55A',
          600: '#498B49',
          700: '#0F4B2D',
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          topbar: '#FFFFFF',
        },
        border: {
          subtle: '#E2E8F0',
          accent: '#E1F5FF',
        },
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        status: {
          green: '#5AA55A',
          darkGreen: '#0F4B2D',
          red: '#EF4444',
          amber: '#F59E0B',
          blue: '#0064FA',
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 100, 250, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
        'elevated': '0 8px 24px -4px rgba(0, 100, 250, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

