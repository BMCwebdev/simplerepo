import process from 'node:process';

export default {
  presets: [
    // Handle JSX with the new automatic runtime (no need to import React)
    ['@babel/preset-react', { runtime: 'automatic' }],

    // Transpile TypeScript (including .tsx) — useful for Babel-based tools like Storybook or Jest.
    // Not strictly needed in Vite or Next.js apps where TypeScript is handled by esbuild or SWC.
    '@babel/preset-typescript',

    // (Optional) Add '@babel/preset-env' if you're targeting older environments or need specific polyfills.
  ],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        // Enable StyleX dev mode (adds class names for easier debugging)
        // This is typically used during development and in Storybook
        dev: process.env.NODE_ENV === 'development',

        // Enable test mode (stable classnames for snapshots)
        // Helps keep snapshots consistent across test runs
        test: process.env.NODE_ENV === 'test',

        // Avoid injecting styles at runtime — we extract styles at build time
        runtimeInjection: false,

        // Generate conditional classes so devs can safely use ternaries in styles
        genConditionalClasses: true,

        // Prevents tree-shaken styles from being lost (needed for fully optimized builds)
        treeshakeCompensation: true,

        // Custom resolution strategy for design tokens and other CommonJS-style modules
        // You can tweak this based on how your own app/library resolves style tokens
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: new URL('.', import.meta.url).pathname, // You may want to use `__dirname` in CJS environments
        },
      },
    ],
  ],
};