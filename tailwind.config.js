/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'black': '#000000',
        'white': '#FFFFFF',
        'primary': {
          'purple': '#5443EF',
          'blue': '#2EB9FF',
        },
        'purple': {
          600: '#4432EC',
          500: '#5443EF',
          400: '#6F61F1',
          300: '#A49BF7',
          50: '#DBD8FD',
          25: '#EDEBFC',
        },
        'blue': {
          600: '#009BF5',
          500: '#2EB9FF',
          400: '#52C6FF',
          300: '#80D4FF',
          50: '#CFEFFF',
          25: '#EBF8FF',
        },
        'red': {
          400: '#FF4747',
          50: '#FFDBDB',
          25: '#FFF3F3',
        },
        // Gray Scale
        'gray': {
          900: '#19181B',
          800: '#28272B',
          700: '#403F45',
          600: '#5A5960',
          500: '#72707A',
          400: '#8C8B93',
          300: '#A5A5AB',
          200: '#C0C0C4',
          100: '#DADADC',
          90: '#E7E7E9',
          75: '#EFEFF0',
          50: '#F2F2F3',
          25: '#FAFAFA',
        },
      },
      fontSize: {
        // Text Styles - Pretendard Variable 폰트 기준
        '56b': ['56px', { lineHeight: '76px', fontWeight: '700', letterSpacing: '0%' }],
        '48b': ['48px', { lineHeight: '66px', fontWeight: '700', letterSpacing: '0%' }],
        '42b': ['42px', { lineHeight: '58px', fontWeight: '700', letterSpacing: '0%' }],
        '36b': ['36px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '0%' }],
        '32b': ['32px', { lineHeight: '44px', fontWeight: '700', letterSpacing: '0%' }],
        '28b': ['28px', { lineHeight: '38px', fontWeight: '700', letterSpacing: '0%' }],
        '24b': ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '0%' }],
        '20b': ['20px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '0%' }],
        '18b': ['18px', { lineHeight: '24px', fontWeight: '700', letterSpacing: '0%' }],
        '18s': ['18px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '0%' }],
        '18m': ['18px', { lineHeight: '24px', fontWeight: '500', letterSpacing: '0%' }],
        '16b': ['16px', { lineHeight: '22px', fontWeight: '700', letterSpacing: '0%' }],
        '16s': ['16px', { lineHeight: '22px', fontWeight: '600', letterSpacing: '0%' }],
        '16m': ['16px', { lineHeight: '22px', fontWeight: '500', letterSpacing: '0%' }],
        '15s': ['15px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0%' }],
        '15m': ['15px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0%' }],
        '14b': ['14px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0%' }],
        '14m': ['14px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0%' }],
        '14r': ['14px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '0%' }],
        '13b': ['13px', { lineHeight: '18px', fontWeight: '600', letterSpacing: '0%' }],
        '13m': ['13px', { lineHeight: '18px', fontWeight: '500', letterSpacing: '0%' }],
        '13r': ['13px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '0%' }],
        '12b': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0%' }],
        '12m': ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0%' }],
        '12r': ['12px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '0%' }],
        '11b': ['11px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0%' }],
        '11m': ['11px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0%' }],
        '11r': ['11px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '0%' }],
        '10m': ['10px', { lineHeight: '14px', fontWeight: '500', letterSpacing: '0%' }],
        '10r': ['10px', { lineHeight: '14px', fontWeight: '400', letterSpacing: '0%' }],
      },
      fontFamily: {
        'pretendard': ['Pretendard Variable', 'sans-serif'],
      },
      // letterSpacing: {
      //   'tight': '-0.03em',
      // },
    },
  },
  plugins: [],
}

