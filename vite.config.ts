import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/__exports/index.ts'),
      name: 'i17n',
      fileName: 'index',
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@src': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },

  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.build.json',
    }),
  ],
});
