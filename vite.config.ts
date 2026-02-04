import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import path from 'node:path';
import manifest from './manifest.json' with { type: 'json' };

export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as any })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        sidepanel: 'src/sidepanel/index.html',
        options: 'src/options/index.html',
        newtab: 'src/newtab/index.html',
      },
    },
  },
  server: { port: 5174 },
});
