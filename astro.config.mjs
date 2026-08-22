import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  site: 'https://nitkkr-food.pages.dev',
  integrations: [
    tailwind(),
    sitemap(),
    mdx(),
  ],
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  output: 'server',
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    optimizeDeps: {
      exclude: ['@astrojs/cloudflare', 'meilisearch', 'drizzle-orm', '@neondatabase/serverless'],
    },
    ssr: {
      noExternal: ['@astrojs/cloudflare', 'meilisearch', 'drizzle-orm', '@neondatabase/serverless'],
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt'],
        manifest: {
          name: 'NITKKR Food',
          short_name: 'NITKKR Food',
          description: 'Find food around NIT Kurukshetra instantly',
          theme_color: '#FF6B35',
          background_color: '#FFF8F0',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
            { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,png,svg,woff2,jpg,webp}'],
          runtimeCaching: [
            { urlPattern: /^https:\/\/.*\.neon\.tech/, handler: 'NetworkFirst', options: { cacheName: 'neon-api', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } } },
            { urlPattern: /^https:\/\/.*\.meilisearch\.cloud/, handler: 'NetworkFirst', options: { cacheName: 'meilisearch-api', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 } } },
            { urlPattern: /^https:\/\/res\.cloudinary\.com/, handler: 'CacheFirst', options: { cacheName: 'cloudinary-images', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } } },
          ],
        },
      }),
    ],
  },
});