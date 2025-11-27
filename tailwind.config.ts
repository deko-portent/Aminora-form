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
        primary: "#1e3a8a", // Royal Navy Blue
        "primary-dark": "#0f172a", // Dark Navy/Black
        success: "#22c55e", // Success Green
        banner: "#A8DADC", // Banner Teal
        "button-outline": "#A8DADC", // Button outline color
        "next-button": "#366081", // Next button color
        ui: "#f3f4f6", // UI Gray
        background: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;

