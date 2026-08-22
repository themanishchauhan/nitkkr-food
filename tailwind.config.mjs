/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'nitkkr-orange': '#FF6B35',
        'nitkkr-orange-dark': '#E85D2D',
        'nitkkr-cream': '#FFF8F0',
        'nitkkr-dark': '#1A1A2E',
        'nitkkr-gray': '#6B7280',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}