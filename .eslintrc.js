module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base/legacy'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-continue': 'off',
    'no-console': 'off'
  },
  ignorePatterns: ['__tests__/**', 'dist/**', 'demo/**', 'example/**']
};
