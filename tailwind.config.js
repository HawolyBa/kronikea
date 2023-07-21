module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary': '#27746c',
        'secondary': '#b4333a',
      },
      height: {
        fullwidth: `calc(100vh - 80px)`
      }
    },
  },
  plugins: [],
}
