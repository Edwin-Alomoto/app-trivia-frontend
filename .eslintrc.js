module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  plugins: ['import', 'react', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/order': ['warn', { groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']], 'newlines-between': 'always' }],
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'react/no-unescaped-entities': 'warn',
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@screens', './src/screens'],
          ['@store', './src/store'],
          ['@services', './src/services'],
          ['@viewmodels', './src/viewmodels'],
          ['@hooks', './src/hooks'],
          ['@types', './src/types'],
          ['@navigation', './src/navigation'],
          ['@validators', './src/validators'],
          ['@config', './src/config'],
          ['@assets', './assets'],
          ['@shared', './src/shared'],
          ['@theme', './src/shared/presentation/theme'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};


