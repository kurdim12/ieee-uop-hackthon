/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ieee: {
          DEFAULT: '#00629B',
          50:  '#E6F2F8',
          100: '#CCE5F1',
          200: '#99CBE3',
          300: '#66B1D5',
          400: '#3397C7',
          500: '#00629B',
          600: '#004F7C',
          700: '#003B5D',
          800: '#00283E',
          900: '#00141F',
        },
        petra: {
          DEFAULT: '#8B2331',
          50:  '#FBEFF1',
          100: '#F4D6DB',
          200: '#E5AAB3',
          300: '#D27D8B',
          400: '#B14F60',
          500: '#8B2331',
          600: '#6F1B27',
          700: '#54141D',
          800: '#380D14',
          900: '#1C070A',
        },
        accent: {
          DEFAULT: '#FFB81C',
          light:   '#FFCF5C',
        },
        // legacy aliases — keep so existing class usage doesn't crash
        paper: '#ffffff',
        'paper-dark': '#f8fafc',
        ink: '#0f172a',
        'ieee-soft': '#E6F2F8',
        'petra-soft': '#FBEFF1',
        moss: '#16a34a',
        'moss-soft': '#dcfce7',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic:  ['"IBM Plex Sans Arabic"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(0, 98, 155, 0.15)',
        card: '0 8px 32px -8px rgba(0, 98, 155, 0.18)',
        // legacy aliases — same look, no longer offset/hard
        brut:        '0 8px 32px -8px rgba(0, 98, 155, 0.18)',
        'brut-sm':   '0 4px 16px -4px rgba(0, 98, 155, 0.15)',
        'brut-ieee': '0 8px 32px -8px rgba(0, 98, 155, 0.22)',
        'brut-petra':'0 8px 32px -8px rgba(139, 35, 49, 0.22)',
        'brut-moss': '0 8px 32px -8px rgba(22, 163, 74, 0.22)',
      },
      borderWidth: { 3: '3px' },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%':      { opacity: 0.4, transform: 'scale(0.85)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee:     'marquee 40s linear infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
