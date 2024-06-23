/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#FFD7CD',
        'navbar': '#FFF7F7',
        'input': '#FFFFFF'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}

