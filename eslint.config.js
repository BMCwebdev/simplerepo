// eslint.config.js (Revisiting "Original Extends" + Ignore Fix)
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginStorybook from "eslint-plugin-storybook"; // Assume FlatCompat needed
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginStylex from "@stylexjs/eslint-plugin";
import pluginVitest from 'eslint-plugin-vitest';

// --- FlatCompat Setup ---
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    // resolvePluginsRelativeTo: __dirname // Optional: If plugins aren't found by compat
});
// --- End FlatCompat Setup ---

// Clean up browser globals
const cleanedBrowserGlobals = Object.fromEntries(
    Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
);

export default tseslint.config(
    // 1. Global Ignores (With Corrected Pattern)
    {
        ignores: [
            "dist/**",
            "storybook-static/**",    // <-- Corrected ignore pattern
            ".eslintrc.cjs",
            "eslint.config.js"
        ]
    },

    // --- 2. Replicate Original 'extends' ---
    js.configs.recommended, // Base ESLint recommended
    ...tseslint.configs.recommended, // Add TS recommended back
    ...compat.extends("plugin:react-hooks/recommended"), // Use FlatCompat for hooks
    ...compat.extends("plugin:storybook/recommended"),  // Use FlatCompat for storybook

    // --- 3. Global Settings, Plugins, Rules ---
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...cleanedBrowserGlobals,
            }
        },
        plugins: {
            // Define plugins for rules used directly or needed for overrides
            '@typescript-eslint': tseslint.plugin,
            'react-hooks': pluginReactHooks,
            'react-refresh': pluginReactRefresh,
            '@stylexjs': pluginStylex,
            // storybook likely handled by compat.extends
            // vitest handled in override below
        },
        settings: {
            react: { version: "detect" }
        },
        linterOptions: {
            reportUnusedDisableDirectives: "warn",
        },
        rules: {
            // --- YOUR SPECIFIC GLOBAL RULES from original config ---
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-explicit-any': 'warn', // Overridden later for tests
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_'}], // Overridden later for tests
            '@stylexjs/valid-styles': ['error', { validImports: ['@stylexjs/stylex'] }],
            '@stylexjs/valid-shorthands': 'warn',
            '@stylexjs/sort-keys': ['warn', { minKeys: 2, allowLineSeparatedGroups: true }],
            // Explicit hooks rules might be redundant now with compat.extends,
            // but shouldn't hurt. Could remove if causing issues.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            // --- END YOUR SPECIFIC GLOBAL RULES ---
        }
    },

    // --- 4. Your Specific Overrides (Same as before) ---
    {
        // Production source files
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: true, // Find main tsconfig.json
                tsconfigRootDir: "."
            }
        }
        // Add any production-specific rule *overrides* here if needed
    },
    {
        // Development files (tests and stories)
        files: [
            'src/**/*.test.ts?(x)',
            'src/**/*.unit.test.ts?(x)',
            'src/**/*.stories.ts?(x)',
            'test/**/*.ts?(x)'
        ],
        plugins: {
             vitest: pluginVitest // Keep Vitest plugin for test files
        },
        rules: {
            // Apply Vitest recommended rules
            ...pluginVitest.configs.recommended.rules,

            // --- Your ORIGINAL rule overrides for dev files ---
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'react-refresh/only-export-components': 'off',
            // --- END Your ORIGINAL rule overrides ---
        },
        languageOptions: {
            globals: {
                // Add vitest globals
                ...pluginVitest.configs.recommended.globals,
            },
            parserOptions: {
                project: ['./tsconfig.dev.json'],
                tsconfigRootDir: "."
            }
        },
    },
    // Separate config files into TypeScript and JavaScript
    {
        // TypeScript config files
        files: ['*.config.ts', 'vite.config.ts'],
        languageOptions: {
             sourceType: 'module',
             parserOptions: {
                project: ['./tsconfig.node.json'],
                tsconfigRootDir: "."
            }
        }
    },
    {
        // JavaScript config files - simply don't use TypeScript parser
        files: ['*.config.js', '*.config.cjs'],
        languageOptions: {
            sourceType: 'module'
            // Don't specify a parser - this will default to Espree (ESLint's default parser)
        }
    }
)