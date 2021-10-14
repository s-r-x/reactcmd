import { IStylingAnalyzer } from '../../analyzers/styling/interface';

export const createStyleAnalyzerMock = (
  args: Partial<IStylingAnalyzer> = {}
): IStylingAnalyzer => ({
  determineStylingStrategy: () => Promise.resolve('css'),
  ...args,
});
