// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslint from '@typescript-eslint/eslint-plugin';

const eslintConfig = defineConfig([
  // Include Next.js base rules
  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      // ✅ Only add plugins not already included by Next.js
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tsEslint,
    },
    rules: {
      //
      // ✅ Basic syntax rules
      //
      semi: ['error', 'always'],
      quotes: [
        'warn',
        'single',
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      indent: ['error', 2],
      'space-before-blocks': 'error',
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

      //
      // ✅ Variables and imports
      //
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'off',

      //
      // ✅ Unused imports & sorting
      //
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react', '^next'], ['^@?\\w'], ['^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      //
      // ✅ General best practices
      //
      eqeqeq: ['error', 'always'],
    },
  },

  //
  // ✅ Ignore paths
  //
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '*.config.js',
  ]),
]);

export default eslintConfig;
