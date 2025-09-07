import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      // Relaxed rules for React Native/Expo
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    ignores: [
      'node_modules/',
      'dist/',
      'web-build/',
      '.expo/',
      'coverage/',
    ],
  },
];
