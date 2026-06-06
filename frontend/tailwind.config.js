/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#2563EB',
        'neon-cyan': '#06B6D4',
        'deep-purple': '#7C3AED',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-border': '#334155',
        'neon-green': '#22C55E',
        'soft-white': '#F8FAFC',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #7C3AED 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.3) 0%, transparent 60%)',
        'gradient-card': 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.05))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient': 'gradientShift 6s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #2563EB44, 0 0 20px #06B6D444' },
          to: { boxShadow: '0 0 20px #7C3AED88, 0 0 40px #2563EB44' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(37,99,235,0.4)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
