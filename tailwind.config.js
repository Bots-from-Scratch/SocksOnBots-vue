/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      pixel: ["Pixel"],
    },
    extend: {
      colors: {
        'black': '#181e26'
      },
      backgroundImage: {
        'hero-image': "url('@/assets/img.png')",
        'pixel-button': "url('@/assets/button.svg')"
      },
      scale: {
        "-100": "-1",
      },
    },
  },
  plugins: [],
};
