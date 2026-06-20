import nextConfig from 'eslint-config-next';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', '.husky/**'],
  },
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      'import/no-anonymous-default-export': 'warn',
    },
  },
];
