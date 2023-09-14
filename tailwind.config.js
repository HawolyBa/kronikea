module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      'sm': '640px',
      'md': '811px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
