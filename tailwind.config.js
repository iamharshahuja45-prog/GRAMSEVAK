/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sevak: {
          green: {
            DEFAULT: '#15803d',
            light: '#dcfce7',
            dark: '#14532d',
            hover: '#166534',
          },
          yellow: {
            DEFAULT: '#ca8a04',
            light: '#fef9c3',
            dark: '#854d0e',
          },
          red: {
            DEFAULT: '#dc2626',
            light: '#fee2e2',
            dark: '#991b1b',
            hover: '#b91c1c',
          },
          neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
