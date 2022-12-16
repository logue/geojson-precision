import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';

import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    // vite-plugin-checker
    // https://github.com/fi3ework/vite-plugin-checker
    checker({
      typescript: true,
      vueTsc: false,
      eslint: {
        lintCommand: `eslint . --fix --cache --cache-location ./node_modules/.vite/vite-plugin-eslint`, // for example, lint .ts & .tsx
      },
    }),
  ],
  // Build Options
  // https://vitejs.dev/config/#build-options
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'GeojsonPrecision',
      formats: ['es', 'umd', 'iife'],
      fileName: format => `index.${format}.js`,
    },
    target: 'esnext',
    minify: false,
  },
});
