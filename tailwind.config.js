/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f4f0e6',
        'paper-dark': '#ece6d4',
        ink: '#0a0a0a',
        amber: '#ff6b1a',
        'amber-soft': '#ffe2cf',
        moss: '#1f3d2b',
        'moss-soft': '#d9e4dc',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brut: '6px 6px 0 0 #0a0a0a',
        'brut-sm': '3px 3px 0 0 #0a0a0a',
        'brut-amber': '6px 6px 0 0 #ff6b1a',
        'brut-moss': '6px 6px 0 0 #1f3d2b',
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
