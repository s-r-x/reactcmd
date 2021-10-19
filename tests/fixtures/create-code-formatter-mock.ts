import { ICodeFormatter } from '../../lib/code-formatter/interface';

export const createCodeFormatterMock = (
  args: Partial<ICodeFormatter> = {}
): ICodeFormatter => ({
  format: input => Promise.resolve(input),
  ...args,
});
