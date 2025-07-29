import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: { lg: "960px", xl: "1120px", "2xl": "1280px" },
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        }
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.06)",
      }
    },
  },
  plugins: [typography, forms],
}
