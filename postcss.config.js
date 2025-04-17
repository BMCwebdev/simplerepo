import process from 'node:process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to find package include paths 
function getPackageIncludePaths(packageName) {
  const projectRoot = __dirname;
  const monorepoRoot = path.join(projectRoot, '../..');
  const nodeModulePaths = [
    path.join(projectRoot, 'node_modules'),
    path.join(monorepoRoot, 'node_modules')
  ];
  
  let packagePath = null;

  for (const nodeModulePath of nodeModulePaths) {
    const packageJsonPath = path.resolve(
      nodeModulePath,
      packageName,
      'package.json'
    );
    if (fs.existsSync(packageJsonPath)) {
      packagePath = path.dirname(packageJsonPath);
      break;
    }
  }
  
  if (!packagePath) {
    console.warn(`Could not find package ${packageName}`);
    return [];
  }

  return [
    path.join(packagePath, '**/*.{js,jsx,ts,tsx}'),
    '!' + path.join(packagePath, 'node_modules/**/*.{js,jsx,ts,tsx}'),
  ];
}

export default () => {
  const isLibraryBuild = Boolean(process.env.VITE_BUILD_LIBRARY);
  const dev = process.env.NODE_ENV !== 'production';
  
  return {
    plugins: {
      // Include StyleX plugin only in dev, Storybook, and test mode (not during library build)
      ...(isLibraryBuild ? {} : {
        '@stylexjs/postcss-plugin': {
          include: [
            './src/**/*.{js,jsx,ts,tsx}',        // include all source files using StyleX
            './.storybook/**/*.{js,jsx,ts,tsx}', // include storybook files
          ],
          useCSSLayers: true,  // use CSS @layers for specificity instead of the StyleX :not(#) hack
          // classNamePrefix: 'stx-', // Match the prefix in Babel config
          fileName: 'simplerepo.css', // Optional: Name the generated CSS file
          outputCSS: true, // Explicitly enable CSS output
          // Use babelConfig to ensure tokens are properly transformed
          babelConfig: {
            babelrc: false,
            parserOpts: {
              plugins: ['typescript', 'jsx'],
            },
            plugins: [
              [
                '@stylexjs/babel-plugin',
                {
                  dev: dev,
                  runtimeInjection: false,
                  genConditionalClasses: true,
                  treeshakeCompensation: true,
                  unstable_moduleResolution: {
                    type: 'commonJS',
                    rootDir: path.resolve()
                  },
                },
              ],
            ],
          },
        },
      }),
      // Always include autoprefixer for vendor prefixes
      'autoprefixer': {},
    },
  };
};