module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    parser: {
      ts: '@typescript-eslint/parser',
      js: '@typescript-eslint/parser',
    },
  },
  plugins: ['no-relative-import-paths', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'src/**/*.test.tsx', 'src/**/*.test.ts'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-undef': ['error'],
    'no-relative-import-paths/no-relative-import-paths': ['error'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
    'prettier/prettier': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['src/*'],
            message: 'src/ should use the @src/ alias instead',
          },
          {
            group: ['*__exports*'],
            message: '__exports/ should not be used for imports',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['jest.config.js'],
    },
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-restricted-imports': 'off',
      },
    },
  ],
};
