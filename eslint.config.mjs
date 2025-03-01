import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a compatibility instance
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    // Base JS recommended rules
    js.configs.recommended,

    // Add TypeScript support
    ...compat.config({
        extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json',
        },
    }),

    // Next.js specific configuration
    ...compat.config({
        extends: ['next/core-web-vitals'],
    }),

    // Unused imports plugin
    ...compat.config({
        plugins: ['unused-imports'],
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    }),

    // Custom rules for all files
    {
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
            eqeqeq: ['error', 'always', { null: 'ignore' }],
        },
    },

    // React specific rules
    {
        files: ['**/*.{jsx,tsx}'],
        rules: {
            'react/prop-types': 'off', // TypeScript handles prop types
            'react/react-in-jsx-scope': 'off', // Not needed in Next.js
            'react/self-closing-comp': 'error', // Enforce self-closing tags
            'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
        },
    },

    // Ignore build output and node_modules
    {
        ignores: ['.next/**', 'node_modules/**', 'public/**', 'dist/**', '.vercel/**'],
    },
];
