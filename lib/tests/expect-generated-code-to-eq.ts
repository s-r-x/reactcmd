import { expect } from 'chai';

import prettier from 'prettier';

export const format = (src: string): string => {
  return prettier.format(src, {
    parser: 'babel',
    semi: true,
    trailingComma: 'none',
    bracketSpacing: false,
    singleQuote: false,
    tabWidth: 2,
    endOfLine: 'lf',
    arrowParens: 'always',
  });
};

export const expectCodeToEq = (output: string, expectOutput: string): void => {
  expect(format(output)).to.eq(format(expectOutput));
};
