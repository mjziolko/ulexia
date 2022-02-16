module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-void': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'max-len': [1, 120, 2, {
      'ignorePattern': '^import.*from.*$'
    }],
    'object-curly-newline': ['error', {
      'ImportDeclaration': 'never'
    }]
  },
};
