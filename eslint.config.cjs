module.exports = [
  { ignores: ['.next/', '.inspo/', 'node_modules/', 'public/', 'js/', 'css/', '*.tsbuildinfo'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': require('@typescript-eslint/eslint-plugin') },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
