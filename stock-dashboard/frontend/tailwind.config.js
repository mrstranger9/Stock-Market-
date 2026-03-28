/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        darkCard: "#1e293b",
        darkBorder: "#334155",
        brandGreen: "#10b981",
        brandRed: "#ef4444"
      }
    },
  },
  plugins: [],
}
