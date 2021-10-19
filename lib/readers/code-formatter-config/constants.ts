import type { Options } from 'prettier';

export const DEFAULT_PRETTIER_CONFIG: Options = {
  semi: true,
  trailingComma: 'none',
  bracketSpacing: false,
  singleQuote: false,
  tabWidth: 2,
  endOfLine: 'lf',
  arrowParens: 'always',
};
