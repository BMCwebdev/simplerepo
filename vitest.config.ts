/// <reference types="vitest" />

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      // Integrate Babel plugin for StyleX in tests
      babel: {
        plugins: [
          [
            '@stylexjs/babel-plugin',
            {
              dev: true, // Enable dev mode for debugging
              test: true, // Enable test mode for consistent classnames in tests
              runtimeInjection: false,
              // classNamePrefix: 'stx-', // Add identifier prefix
              genConditionalClasses: true,
              treeshakeCompensation: true,
              unstable_moduleResolution: {
                type: 'commonJS',
                rootDir: path.resolve(),
              },
            },
          ],
        ],
      },
    }),
  ],
  css: {
    // Use the same PostCSS config as the main build
    postcss: path.resolve(path.resolve(), 'postcss.config.js'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
});
