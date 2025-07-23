/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "15px"
    },
    extend: {
      colors: {
        primary: '#7ED957',      // Xanh lá non tươi sáng
        secondary: '#A7D8F5',    // Xanh trời nhạt
        accent: '#FFE066',       // Vàng cỏ khô sáng
        earth: '#D9B382',        // Nâu đất nhạt
        light: '#F8F9FA',        // Trắng/xám sáng
      },
    },
  },
  plugins: [],
}
