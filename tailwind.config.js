/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      filter: {
        'custom-white': 'filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(3675%) hue-rotate(56deg) brightness(105%) contrast(109%);'
      },
      colors: {
        myBlue: {
          100: "#34a4fc",
          200: "#124f96",
          300: "#0f4386",
        },
        myYellow: {
          100: "#FFD329",
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

