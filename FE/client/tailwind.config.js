/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Figma tokens, verified against the vector export (website.svg) —
        // extracted fills there (#C78A2F, #A37C15, #BD8C1A, #1E1B16,
        // #FCF2EB, #D5C4B1...) confirm the same family as these hex values.
        gold: {
          DEFAULT: "#A48238", // primary button fill / active pill
          light: "#B89748",   // hover state
          dark: "#835400",    // pressed / deep accent (from SVG: #835400)
        },
        cream: {
          DEFAULT: "#FDFBF7", // card background
          soft: "#F9F6EE",
        },
        sandbox: {
          DEFAULT: "#ECE7DC", // secondary / neutral containers, unselected pills
          dark: "#E2DDD1",
        },
        ink: {
          DEFAULT: "#211D18", // dark footer
          soft: "#1E1A16",
        },
        line: "#D6C8A5", // card border color -> border-line
        teal: {
          DEFAULT: "#006B5D", // Red Sea / interests-section accent (from SVG)
          light: "#43A695",
        },
      },
      fontFamily: {
        // Headings in the Figma export read as an elegant serif (the
        // "EGI RISES" wordmark, "Plan your journey...", "Luxor Temple"
        // card titles) — not the sans-serif Poppins used previously.
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "Cairo", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "gold-glow": "0 0 0 4px rgba(164, 130, 56, 0.15)",
        card: "0 10px 30px -10px rgba(33, 29, 24, 0.12)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
