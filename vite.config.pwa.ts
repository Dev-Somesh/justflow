// Vite plugin for PWA and asset optimization
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'JustFlow',
        short_name: 'JustFlow',
        description: 'Agile project management for modern teams',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'justflow-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'justflow-dashboard.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
