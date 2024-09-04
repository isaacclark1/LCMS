import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["/favicon.ico", "/apple-touch-icon.png", "/mask-icon.svg"],
      manifest: {
        name: "Leisure Centre Management System",
        short_name: "LCMS",
        description: "Leisure Centre Management System",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        scope: "/",
        theme_color: "#172554",
      },
      workbox: {
        globPatterns: ["**/*.{js,ts,jsx,tsx,css,html,ico,png,jpeg,svg}"],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // Image files - serve from cache first as these will not change. Update every 31 days.
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 31 * 24 * 60 * 60,
              },
            },
          },
          // JS files, HTML and CSS files - Fetch from cache and then immediately update the cached content after they are fetched.
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "document",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
          // UC1 - Get cleaning task list from network; if no network get from cache.
          {
            urlPattern: new RegExp("^.*?(?=/uc1/\\d+$)"),
            handler: "NetworkFirst",
            options: {
              cacheName: "uc1-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UC2 - Get cleaning task template list from network; if no network get from cache.
          {
            urlPattern: new RegExp("^.*?(?=/uc2/\\d+$)"),
            handler: "NetworkFirst",
            options: {
              cacheName: "uc2-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - Get cleaning task template lists from network; if no network get from cache.
          {
            urlPattern: ({ url }) => url.pathname.endsWith("/ui/cleaningTaskTemplateLists"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-cleaningtasktemplatelists-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - Get cleaning task templates from a cleaning task list from network; if no network get from cache.
          {
            urlPattern: new RegExp("^.*?(?=/ui/cleaningTaskTemplates/\\d+$)"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getcleaningtasktemplatesfromcleaningtasktemplatelist-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - Get cleaning task templates from network; if no network get from cache.
          {
            urlPattern: ({ url }) => url.pathname.endsWith("ui/cleaningTaskTemplates"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getcleaningtasktemplates-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - get areas from network; if no network get from cache.
          {
            urlPattern: ({ url }) => url.pathname.endsWith("ui/areas"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getareas-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - get cleaning task lists from network; if no network get from cache.
          {
            urlPattern: ({ url }) => url.pathname.endsWith("ui/cleaningTaskLists"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getcleaningtasklists-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },

          // UI - get cleaning tasks from cleaning task list from network; if no network get from cache.
          {
            urlPattern: new RegExp("^.*?(?=/ui/cleaningTasks/\\d+$)"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getcleaningtasksfromcleaningtasklist-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          // UI - get staff members from network; if no network get from cache.
          {
            urlPattern: ({ url }) => url.pathname.endsWith("ui/staffMembers"),
            handler: "NetworkFirst",
            options: {
              cacheName: "ui-getstaffmembers-endpoint-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      strategies: "generateSW",
    }),
  ],
});
