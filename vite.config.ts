import { fileURLToPath, URL } from 'node:url';

import { defineConfig, type UserConfig } from 'vite';

import { checker } from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

// Export vite config
export default defineConfig(async ({ command }): Promise<UserConfig> => {
  // Hook production build.
  // https://vitejs.dev/config/
  const config: UserConfig = {
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        vueTsc: false,
        // eslint: { lintCommand: 'eslint' },
      }),
      // vite-plugin-dts
      // https://github.com/qmhc/vite-plugin-dts
      dts(),
    ],
    // Build Options
    // https://vitejs.dev/config/#build-options
    build: {
      lib: {
        entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        name: 'GeojsonPrecision',
        formats: ['es', 'umd', 'iife'],
        fileName: format => `index.${format}.js`,
      },
      target: 'esnext',
      // minify: false,
    },
    esbuild: {
      drop: command === 'serve' ? [] : ['console'],
    },
  };

  return config;
});
