import { IEnvAnalyzer } from '../../analyzers/env/interface';

export const createEnvAnalyzerMock = (
  args: Partial<IEnvAnalyzer> = {}
): IEnvAnalyzer => ({
  determineSourceDir: () => Promise.resolve('/src'),
  determineComponentsDir: () => Promise.resolve(null),
  determineLang: () => Promise.resolve('js'),
  ...args,
});
