module.exports = [
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
