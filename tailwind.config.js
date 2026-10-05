/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#090C05',
        surface: '#151A0B',
        surface2: '#202612',
        card: '#181D0D',
        line: '#353C20',
        accent: '#E8FF3D',
        accent2: '#B9D62A',
        ink: '#F5F7E9',
        sub: '#9A9F88',
        mute: '#686D5B',
      },
      borderRadius: { card: '24px' },
      boxShadow: { soft: '0 8px 30px rgba(0,0,0,0.35)' },
      fontFamily: { sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'] },
      keyframes: {
        pop: { '0%': { opacity: 0, transform: 'scale(.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        fade: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      },
      animation: { pop: 'pop .2s ease-out', fade: 'fade .2s ease-out' },
    },
  },
  plugins: [],
};
