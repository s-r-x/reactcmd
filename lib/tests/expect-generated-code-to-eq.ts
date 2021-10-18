import { expect } from 'chai';
import prettier from 'prettier';
import { DEFAULT_PRETTIER_CONFIG } from '../readers/code-formatter-config/constants';

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
    ...DEFAULT_PRETTIER_CONFIG,
  });
};

export const expectCodeToEq = (
  output: string,
  expectOutput: string,
  opts?: IFormatOpts
): void => {
  expect(format(output, opts)).to.eq(format(expectOutput, opts));
};
