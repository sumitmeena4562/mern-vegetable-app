/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2bee6c",
        "primary-dark": "#1fa54c",
        "secondary": "#e7f3eb",
        "background-light": "#f8fcf9",
        "background-dark": "#102216",
        "accent-yellow": "#fcf9e8",
        "text-main": "#0e1b13",
          "bg-main": "#f0f9f4",
        "primary-green-start": "#16a34a",
        "primary-green-end": "#22c55e",
        "earth-yellow": "#ca8a04",
        "earth-brown": "#7c2d12",
        "glass-white": "rgba(255, 255, 255, 0.95)",
        "glass-border": "rgba(255, 255, 255, 0.5)",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
       boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
      },
        fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "mono": ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}