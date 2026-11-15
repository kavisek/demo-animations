/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-48px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(48px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "var(--typing-width, 100%)" },
        },
        caret: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        // --- Tables & data ---
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(24px)" },
        },
        "flash-up": {
          "0%": { backgroundColor: "rgb(187 247 208)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-down": {
          "0%": { backgroundColor: "rgb(254 202 202)" },
          "100%": { backgroundColor: "transparent" },
        },
        "row-highlight": {
          "0%, 30%": { backgroundColor: "rgb(254 249 195)" },
          "100%": { backgroundColor: "transparent" },
        },
        "grow-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        draw: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        march: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-12" },
        },
        // --- iOS ---
        jiggle: {
          "0%, 100%": { transform: "rotate(-1.6deg)" },
          "50%": { transform: "rotate(1.6deg)" },
        },
        "banner-in": {
          "0%": { opacity: "0", transform: "translateY(-120%) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.85)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "hud-in": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        // Overshoots slightly, like a spring
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        // The curve iOS uses for sheets and navigation pushes
        ios: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "slide-in-left": "slide-in-left 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "slide-in-right": "slide-in-right 600ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        wave: "wave 1.1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 14s linear infinite",
        "spin-reverse": "spin 10s linear infinite reverse",
        typing: "typing 2.4s steps(28, end) both, caret 0.8s step-end infinite",
        shimmer: "shimmer 2s linear infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
        "pop-in": "pop-in 150ms ease-out both",
        // --- Tables & data ---
        "fade-in": "fade-in 400ms ease-out both",
        "fade-out": "fade-out 300ms ease-in both",
        "flash-up": "flash-up 1.2s ease-out",
        "flash-down": "flash-down 1.2s ease-out",
        "row-insert": "fade-in 300ms ease-out both, row-highlight 2s ease-out",
        "grow-x": "grow-x 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        draw: "draw 1.4s ease-out both",
        march: "march 0.5s linear infinite",
        // --- iOS ---
        jiggle: "jiggle 0.28s ease-in-out infinite",
        "banner-in": "banner-in 550ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "bubble-in": "bubble-in 380ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "hud-in": "hud-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};
