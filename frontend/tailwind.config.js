/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFCE1A',
        secondary: "#0D0842",
        blackBG: '#F3F3F3',
        Favorite: '#FF5841',
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
      },
      // ✅ Add custom maxWidth for 1440px
      maxWidth: {
        '8xl': '90rem', // 1440px
      },
      // ✅ Add custom screen breakpoint for 1440px
      screens: {
        '8xl': '1440px',
      },
    },
    // ✅ Use default container behavior
    container: {
      center: true,
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1920px", // Optional: full width container max
      },
    },
  },
  plugins: [],
};
