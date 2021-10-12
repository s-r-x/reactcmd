import { expect } from 'chai';

import prettier from 'prettier';

interface IFormatOpts {
  parser?: prettier.Options['parser'];
}
export const format = (
  src: string,
  { parser = 'babel' }: IFormatOpts = {
    parser: 'babel',
  }
): string => {
  return prettier.format(src, {
    parser,
    semi: true,
    trailingComma: 'none',
    bracketSpacing: false,
    singleQuote: false,
    tabWidth: 2,
    endOfLine: 'lf',
    arrowParens: 'always',
  });
};

export const expectCodeToEq = (
  output: string,
  expectOutput: string,
  opts?: IFormatOpts
): void => {
  expect(format(output, opts)).to.eq(format(expectOutput, opts));
};
