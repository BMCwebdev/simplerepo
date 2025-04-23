import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import type { Plugin, TransformResult } from 'vite';
import path from 'path';

// Create a plugin to inject 'use client'
const injectUseClient = (): Plugin => ({
  name: 'inject-use-client',
  transform(code: string, id: string): TransformResult {
    if (
      (id.endsWith('.tsx') || id.endsWith('.ts')) &&
      id.includes('/src/components/') &&
      !id.includes('.test.') &&
      !id.includes('.stories.')
    ) {
      const useClientDirective = '"use client";\n\n';
      if (!code.startsWith('"use client"')) {
        return {
          code: useClientDirective + code,
          map: null,
        };
      }
    }
    return {
      code,
      map: null,
    };
  },
});

export default defineConfig(({ mode }) => {
  const isLibraryBuild = !!process.env.VITE_BUILD_LIBRARY;
  return {
    plugins: [
      injectUseClient(),
      react({
        // Integrate Babel plugin for StyleX in dev, storybook, test
        babel: {
          plugins: isLibraryBuild
            ? []
            : [
                [
                  '@stylexjs/babel-plugin',
                  {
                    dev: mode === 'development', // true for vite serve (dev, storybook)
                    test: mode === 'test', // true for vitest
                    runtimeInjection: false,
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
      dts({
        // Configuration options for vite-plugin-dts
        include: ['./src/**/*.ts', './src/**/*.tsx'],
        exclude: ['**/*.stories.tsx', '**/*.test.tsx', './src/App.tsx'],
        outDir: './dist/types',
        staticImport: true,
      }),
    ],
    css: {
      // Vite will automatically load postcss.config.js, but ensure the env is passed
      postcss: path.resolve(path.resolve(), 'postcss.config.js'),
    },
    build: {
      copyPublicDir: false,
      lib: {
        entry: './src/index.ts', // Your library's entry point
        name: 'simplerepo', // A name for your library, used in UMD builds
        fileName: (format) => `simplerepo.${format}.js`, // Naming pattern for output files
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          'react-aria-components',
          '@stylexjs/stylex',
          'vite-plugin-stylex',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
            'react/jsx-dev-runtime': 'jsxDevRuntime',
            'react-aria-components': 'ReactAriaComponents',
            '@react-aria/toast': 'ReactAriaToast',
            '@stylexjs/stylex': 'stylex',
          },
        },
      },
      sourcemap: true, // Optional: Enable source map generation for debugging
      esbuild: {
        target: 'esnext',
      },
    },
  };
});
