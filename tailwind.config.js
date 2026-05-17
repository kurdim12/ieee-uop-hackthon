/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f6f8fb',
        'paper-dark': '#e7ecf2',
        ink: '#0a1a2f',
        ieee: '#00629B',
        'ieee-soft': '#dceaf3',
        petra: '#a8242f',
        'petra-soft': '#f3dee0',
        moss: '#1f6e3a',
        'moss-soft': '#d9e8de',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brut: '6px 6px 0 0 #0a1a2f',
        'brut-sm': '3px 3px 0 0 #0a1a2f',
        'brut-ieee': '6px 6px 0 0 #00629B',
        'brut-petra': '6px 6px 0 0 #a8242f',
        'brut-moss': '6px 6px 0 0 #1f6e3a',
      },
      borderWidth: {
        3: '3px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.85)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
