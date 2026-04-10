import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          brand: '#14EAEA',
        },
        pink: {
          brand: '#F813BE',
        },
        lime: {
          brand: '#B9FF33',
        },
        ink: '#0A0A0A',
        carbon: '#333333',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        urbanist: ['Urbanist', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        sans: ['Public Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'public-sans': ['Public Sans', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20,234,234,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(20,234,234,0.7)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
