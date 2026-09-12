import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { config } from 'dotenv';

config({ path: '.dev.vars' });

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: process.env.SITE_URL || 'https://orandus.pages.dev',
  devToolbar: {
    enabled: false,
  },
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
        '@lib': path.resolve('./src/lib'),
      },
    },
    optimizeDeps: {
      exclude: ['@astrojs/cloudflare', 'drizzle-orm'],
    },
    ssr: {
      noExternal: ['@astrojs/cloudflare', 'drizzle-orm'],
    },

    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt'],
        manifest: {
          name: 'Orandus',
          short_name: 'Orandus',
          description: 'Find food spots and menus instantly',
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
            // 1. Instant offline search index (NetworkFirst with cache fallback)
            {
              urlPattern: /\/api\/search-index\.json/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'orandus-search-index',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // 2. High-performance caching for dish and stall photos (Unsplash & Cloudinary)
            {
              urlPattern: /^https:\/\/(images\.unsplash\.com|res\.cloudinary\.com)\/.*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'orandus-images-cache',
                expiration: {
                  maxEntries: 250,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // 3. StaleWhileRevalidate for vendor menu pages and search route
            {
              urlPattern: /\/(v\/[a-z0-9\-]+|search)?$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'orandus-pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 3, // 3 days
                },
              },
            },
          ],
        },
      }),
    ],
  },
});