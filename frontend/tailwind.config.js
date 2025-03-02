/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo
        secondary: "#FACC15", // Amber
        backgroundLight: "#F8FAFC", // Slate-50
        backgroundDark: "#1E293B", // Slate-800
        textLight: "#1E293B", // Slate-800
        textDark: "#F8FAFC", // Slate-50
      },
    },
  },
  plugins: [],
};
