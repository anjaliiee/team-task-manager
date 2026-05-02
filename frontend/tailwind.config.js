/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0f172a",
        card: "#1e293b",
        border: "#334155",
        primary: "#3b82f6",
        darkBg: "#1e1e2f",
        darkCard: "#2a2a40",
        sidebar: "#2b2b5a",
        secondary: "#7c3aed",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};