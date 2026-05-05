/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zayra: {
          teal: '#00C2B2',
          navy: '#0D1B2A',
          'navy-mid': '#1B3A55',
          mint: '#E0F7F5',
          'mint-light': '#F0FAFA',
          accent: '#00B4A6',
          'accent-dark': '#007A70',
          gray: '#6B7280',
          'gray-light': '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'zayra-gradient': 'linear-gradient(135deg, #E0F7F5 0%, #B2EBE8 50%, #D0F0EE 100%)',
        'teal-gradient': 'linear-gradient(135deg, #00C2B2 0%, #0D1B2A 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0D1B2A 0%, #1B3A55 100%)',
      },
      boxShadow: {
        'zayra': '0 4px 24px rgba(0, 194, 178, 0.12)',
        'zayra-lg': '0 8px 40px rgba(0, 194, 178, 0.18)',
        'card': '0 2px 16px rgba(13, 27, 42, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
