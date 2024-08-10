import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default tseslint.config(
  {
    ignores: ['typings/*', 'src/lib/sandbox/*']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      quotes: [
        'error', 'single',
      ],
      'jsx-quotes': [
        'error', 'prefer-double'
      ],
      indent: [
        'error', 2
      ],
      'object-curly-spacing':[
        'error', 'always'
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    },
  },
  {
    files: ['postcss.config.js'],
    rules: {
      'no-undef': 'off'
    }
  }
);
