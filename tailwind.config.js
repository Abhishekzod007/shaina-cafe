/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {keyframes: {
    softPopup: {
      "0%": {
        opacity: "0",
        transform: "translateY(10px) scale(0.96)",
      },
      "100%": {
        opacity: "1",
        transform: "translateY(0) scale(1)",
      },
    },
    fadeBg: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
  },
  animation: {
    softPopup: "softPopup 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
    fadeBg: "fadeBg 0.25s ease-out",
  },},
  },
  plugins: [],
}
