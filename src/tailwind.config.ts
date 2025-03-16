
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1800px",
      },
    },
    extend: {
      maxWidth: {
        "8xl": "1800px",
        "9xl": "2000px",
        "screen-2xl": "100vw",
      },
      screens: {
        "3xl": "1800px",
      },
      colors: {
        primary: {
          DEFAULT: "#1E3A8A", // Deep Blue
          foreground: "#FFFFFF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E3A8A",
          900: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#EFF6FF",
          foreground: "#1E3A8A",
        },
        accent: {
          DEFAULT: "#9b87f5", // New purple accent color
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        heading: ["Playfair Display", "serif"], // Changed from "display" to "heading"
      },
      spacing: {
        "navbar-height": "70px",
        "sidebar-width": "280px",
      },
      gridTemplateColumns: {
        "auto-fill-card": "repeat(auto-fill, minmax(280px, 1fr))",
        "auto-fill-card-lg": "repeat(auto-fill, minmax(320px, 1fr))",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right, #1E3A8A 0%, #3B82F6 100%)',
        'cta-pattern': 'linear-gradient(90deg, hsla(224, 78%, 29%, 0.9) 0%, hsla(221, 45%, 73%, 0.8) 100%)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
