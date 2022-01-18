const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  mode: 'jit',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './public/**/*.html',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './pages/**/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'zm': { 'min': '0px', 'max': '639px' },
      'ipad': '885px',
      ...defaultTheme.screens
    },
    flex: {
      '1': '1 1 0%',
      auto: '1 1 auto',
      inherit: 'inherit',
      none: 'none',
      '2': '2 2 0%',
      '3': '3 3 0%',
      '4': '4 4 0%',
      '5': '5 5 0%',
      '6': '6 6 0%',
    },
    extend: {
      width: {
        "1.52/2": "49.5%",
        "1.5/2": "48%",
        "1.4/2": "47%",
        "1.5/6": "15%",
        "2.5/6": "31%",
      },
      fontSize: {
        'xxs': '0.5rem'
      },
      // fontFamily: {
      //   "Poppins": ['Poppins', 'sans-serif'],
      //   "Kanit": ['Kanit', 'sans-serif'],
      // },

    },
    variants: {
      extend: {

      },
    },
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
    ]
  }
}