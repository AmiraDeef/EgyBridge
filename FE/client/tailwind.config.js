/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#E09F3E", // Sun Gold — primary accent
          dark: "#C48828",    // Dark Gold — hover/secondary
          light: "#F4D9A8",
        },
        charcoal: {
          DEFAULT: "#3A3427", // Sand Charcoal — headings/body
          deep: "#1E1E1E",
        },
        sand: {
          DEFAULT: "#FAF7F2", // Light background
          soft: "#FFFDF9",
          line: "#E8E2D8",    // Input/card borders
        },
      },
      fontFamily: {
        display: ["Poppins", "Cairo", "sans-serif"],
        body: ["Inter", "Cairo", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 0 4px rgba(224, 159, 62, 0.15)",
        card: "0 4px 24px -4px rgba(58, 52, 39, 0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "sun-pulse": {
          "0%, 100%": { opacity: 0.55 },
          "50%": { opacity: 0.85 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "sun-pulse": "sun-pulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
