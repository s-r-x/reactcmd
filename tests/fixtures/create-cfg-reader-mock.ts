import type { IConfigReader } from '../../lib/readers/config/interface';

export const createCfgReaderMock = (
  args: Partial<IConfigReader> = {}
): IConfigReader => ({
  readConfig: () => Promise.resolve(null),
  getSrcDir: () => Promise.resolve(null),
  getConfigPath: () => Promise.resolve(null),
  ...args,
});
