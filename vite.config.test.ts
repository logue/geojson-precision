import { defineConfig } from 'vite';
import viteTestPlugin from 'vite-plugin-test';

export default defineConfig({
  plugins: [
    // https://github.com/aelbore/vite-plugin-test
    viteTestPlugin({
      watch: true,
    }),
  ],
});
