import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAFBF7",
          50: "#FFFFFF",
          100: "#FAFBF7",
          200: "#F4F6F0",
          300: "#E2E8F0",
        },
        palm: {
          deep: "#0B4F35",
          green: "#15803D",
          light: "#22C55E",
          900: "#0B4F35",
          800: "#0F6343",
          700: "#127A4D",
          600: "#15803D",
          100: "#E6F4ED",
          50: "#F0FDF4",
        },
        sand: {
          DEFAULT: "#E2E8F0",
          dark: "#CBD5E1",
          100: "#FFFFFF",
          200: "#F8FAFC",
          300: "#E2E8F0",
        },
        brown: {
          karupatti: "#78350F",
          accent: "#92400E",
        },
        text: {
          primary: "#0F291E",
          secondary: "#475569",
          muted: "#64748B",
        },
        gold: {
          accent: "#F59E0B",
          500: "#F59E0B",
          400: "#FBBF24",
          300: "#FDE047",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(11, 79, 53, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 16px 32px -4px rgba(11, 79, 53, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
        floating: "0 12px 35px -5px rgba(11, 79, 53, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'subtle-zoom': {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'subtle-zoom': 'subtle-zoom 20s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

