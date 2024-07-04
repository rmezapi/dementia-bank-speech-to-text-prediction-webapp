import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    postcss({
      extract: true, // Extract CSS to a separate file
    }),
  ],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'app/root.tsx'), // Define your entry point here
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },
});