module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'blob': 'blob 8s ease-in-out infinite',
        'blob-slow': 'blob-slow 10s ease-in-out infinite',
        'blob-slower': 'blob-slower 12s ease-in-out infinite',
        'slideIn': 'slideIn 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s ease-out',
      },
      keyframes: {
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3) translateY(-100px)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1) translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(5deg)',
          },
        },
        blob: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(200px, -180px) scale(1.2)',
          },
          '50%': {
            transform: 'translate(-200px, 150px) scale(0.85)',
          },
          '75%': {
            transform: 'translate(150px, 180px) scale(1.1)',
          },
        },
        'blob-slow': {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(-220px, 160px) scale(1.15)',
          },
          '50%': {
            transform: 'translate(180px, -140px) scale(0.88)',
          },
          '75%': {
            transform: 'translate(-160px, -190px) scale(1.08)',
          },
        },
        'blob-slower': {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(210px, 220px) scale(1.18)',
          },
          '66%': {
            transform: 'translate(-190px, -150px) scale(0.9)',
          },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
