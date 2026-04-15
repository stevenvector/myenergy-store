/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#b026ff',
          pink: '#ff2d78',
          green: '#39ff14',
          cyan: '#00f5ff',
          orange: '#ff6600',
          yellow: '#ffe600',
        },
        dark: {
          900: '#050508',
          800: '#0a0a10',
          700: '#0f0f1a',
          600: '#141420',
          500: '#1a1a2e',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #b026ff 0%, #ff2d78 50%, #39ff14 100%)',
        'neon-gradient-2': 'linear-gradient(135deg, #00f5ff 0%, #b026ff 50%, #ff2d78 100%)',
        'dark-grid': 'linear-gradient(rgba(176, 38, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(176, 38, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(176, 38, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 45, 120, 0.6), 0 0 40px rgba(255, 45, 120, 0.3)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.6), 0 0 40px rgba(57, 255, 20, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(0, 245, 255, 0.3)',
        'neon-card': '0 0 30px rgba(176, 38, 255, 0.2), inset 0 0 30px rgba(176, 38, 255, 0.05)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'neon-flicker': 'neonFlicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { textShadow: '0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 40px #b026ff' },
          '100%': { textShadow: '0 0 20px #ff2d78, 0 0 40px #ff2d78, 0 0 80px #ff2d78' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
