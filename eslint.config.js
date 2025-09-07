export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Basic rules for now
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'web-build/**',
      '.expo/**',
      'coverage/**',
      '*.config.js',
    ],
  },
];
