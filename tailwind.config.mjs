/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Bistro color palette - warm, food-inspired
        bistro: {
          50:  '#FEF7F0',
          100: '#FDEDD5',
          200: '#FAD9B8',
          300: '#F5C08A',
          400: '#EF9F5A',
          500: '#E87D2E',
          600: '#D6651F',
          700: '#B84F18',
          800: '#963E16',
          900: '#783314',
        },
        // Semantic aliases (updated to bistro palette)
        'nitkkr-orange': '#E87D2E',
        'nitkkr-orange-dark': '#D6651F',
        'nitkkr-cream': '#FEF7F0',
        'nitkkr-dark': '#1A1A2E',
        'nitkkr-gray': '#6B7280',
        // Accent colors for vibe chips
        spice: {
          500: '#E85D2D',
        },
        veg: {
          500: '#2D9C3D',
        },
        protein: {
          500: '#D46B08',
        },
        late: {
          500: '#6366F1',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}