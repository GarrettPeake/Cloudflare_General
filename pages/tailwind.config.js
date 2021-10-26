module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': {'min': '0px', 'max': '550px'},
      'md': {'min': '551px', 'max': '950px'},
      'lg': {'min': '951px', 'max': '1250px'},
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
