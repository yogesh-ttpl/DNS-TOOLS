/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        lbold: ["Lato-bold", "sans-serif"],
        lthin: ["Lato-light", "sans-serif"],
      },
    },
    screens: {
      lg: { min: "992px", max: "1279px" }, // from large to extra large
      xl: { min: "1280px", max: "1365px" },
      xxl: { min: "1366px", max: "1919px" },
      xxxl: { min: "1920" },
    },
  },
  plugins: [],
  important: true,
};
