/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#172B3A',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#486581',
          600: '#334E68',
          700: '#243B53',
          800: '#172B3A',
          900: '#0E1B25',
        },
        forest: {
          DEFAULT: '#1F5145',
          light: '#2D7564',
          dark: '#14362E',
        },
        gold: {
          DEFAULT: '#C5A66A',
          50: '#FAF7EE',
          100: '#F4ECD8',
          200: '#E7D7AF',
          300: '#D9C187',
          400: '#C5A66A',
          500: '#AA8847',
          600: '#876B34',
        },
        ivory: {
          DEFAULT: '#F8F7F2',
          warm: '#EDE9DF',
          muted: '#DFD8C8',
        },
        madura: {
          text: '#202A30',
          muted: '#75818A',
          border: '#E2DFD7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(23, 43, 58, 0.05)',
        'elevated': '0 10px 30px -5px rgba(23, 43, 58, 0.1)',
      }
    },
  },
  plugins: [],
}
