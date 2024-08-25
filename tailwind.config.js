module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lightblue: '#4091F7',
        lightblueDarker: '#2E5FAC',
        xdLightBlue: '#0093FF',
        xdLightBlueDarker: '#1760B2',
        xdDarkblue: '#013188',
        darkblue: '#113083',
        white: '#FFFFFF',
        black: '#000000',
        lightblack: '#363D40',
        gray: '#EDEDED',
        grayPlaceholder: '#7F7F7F',
        orange: '#FFB100',
        red: '#FF0000',
        lightred: '#FF5C5C',
        green: '#0B9A21',
      },
      fontSize: {
        xxxxs: '0.5rem',
        xxxs: '0.6rem',
        xxs: '0.7rem',
      },
    },
  },

  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
};
