/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#1a1a1f',
        border: '#2a2a32',
        muted: '#a1a1aa',
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.25)',
        glow: '0 0 24px rgba(99,102,241,0.2)',
      },
    },
  },
  plugins: [],
};
